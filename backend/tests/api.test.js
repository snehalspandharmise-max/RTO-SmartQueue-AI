import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { inMemoryDB } from '../src/config/db.js';
import { PredictionService } from '../src/services/predictionService.js';
import { RecommendationService } from '../src/services/recommendationService.js';
import { WorkloadService } from '../src/services/workloadService.js';
import { AnalyticsService } from '../src/services/analyticsService.js';

describe('RTO SmartQueue AI — Backend Test Suite', () => {
  beforeEach(() => {
    // Reset database to clean seed state before each test
    inMemoryDB.reset();
  });

  // 1. Health & Configuration
  it('GET /api/health should return 200 OK and system status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.database).toBeDefined();
    expect(res.body.academicProject).toBe(true);
  });

  it('GET /api/offices returns verified Maharashtra RTO catalogue with search and region filtering', async () => {
    const res = await request(app).get('/api/offices');
    expect(res.status).toBe(200);
    expect(res.body.offices).toBeInstanceOf(Array);
    expect(res.body.offices.length).toBeGreaterThanOrEqual(10);
    expect(res.body.regions).toBeInstanceOf(Array);
    expect(res.body.disclaimer).toContain('Maharashtra Motor Vehicle Department');

    // Test search filter by RTO code
    const searchRes = await request(app).get('/api/offices?search=MH-12');
    expect(searchRes.status).toBe(200);
    expect(searchRes.body.offices.some(o => o.office_code === 'MH-12')).toBe(true);
    expect(searchRes.body.offices.every(o => o.office_code === 'MH-12' || o.city.includes('Pune'))).toBe(true);

    // Test region filter
    const regionRes = await request(app).get('/api/offices?region=' + encodeURIComponent('Mumbai Metropolitan Region (MMR)'));
    expect(regionRes.status).toBe(200);
    expect(regionRes.body.offices.every(o => o.region === 'Mumbai Metropolitan Region (MMR)')).toBe(true);
  });

  // 2. Authentication & Citizen Registration
  it('POST /api/auth/register should create a citizen account with role strictly locked to citizen', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test.citizen@example.com',
        password: 'password123',
        full_name: 'Test Citizen',
        role: 'admin' // Attempting to escalate role
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('citizen'); // Escalation prevented!
  });

  it('POST /api/auth/login should authenticate citizen and administrator accounts', async () => {
    // Citizen login
    const citizenRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'citizen@smartqueue.demo', password: 'citizen123' });
    expect(citizenRes.status).toBe(200);
    expect(citizenRes.body.user.role).toBe('citizen');

    // Admin login
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@smartqueue.demo', password: 'admin123' });
    expect(adminRes.status).toBe(200);
    expect(adminRes.body.user.role).toBe('admin');
  });

  // 3. Security & RBAC Isolation
  it('Unauthorized request to protected endpoint should return 401', async () => {
    const res = await request(app).get('/api/appointments/my');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('Citizen should be forbidden from accessing admin endpoints (403)', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', 'Bearer demo-citizen-token');

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('Administrator can access admin endpoints with verified role', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', 'Bearer demo-admin-token');

    expect(res.status).toBe(200);
    expect(res.body.stats).toBeDefined();
  });

  // 4. Tenant Isolation: Citizens cannot view another citizen\'s appointment
  it('Citizen should be blocked from viewing another citizen appointment (403)', async () => {
    // Appointment e0000000-0000-0000-0000-000000000001 belongs to Priya Patel (user 3333...)
    // Demo citizen (user 2222...) tries to access it:
    const res = await request(app)
      .get('/api/appointments/e0000000-0000-0000-0000-000000000001')
      .set('Authorization', 'Bearer demo-citizen-token');

    expect(res.status).toBe(403);
  });

  // 5. Appointment Booking & Concurrency Protection
  it('Citizen can book an appointment and receive a unique booking reference and queue token', async () => {
    const office = inMemoryDB.findAll('rto_offices')[0];
    const service = inMemoryDB.findAll('services')[1]; // LL
    const slot = inMemoryDB.insert('appointment_slots', {
      office_id: office.id,
      service_id: service.id,
      slot_date: new Date().toISOString().split('T')[0],
      start_time: '16:00:00',
      end_time: '17:00:00',
      max_capacity: 5,
      booked_count: 0,
      is_active: true
    });

    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', 'Bearer demo-citizen-token')
      .send({
        office_id: office.id,
        service_id: service.id,
        slot_id: slot.id,
        notes: 'Learner licence test'
      });

    expect(res.status).toBe(201);
    expect(res.body.appointment.booking_reference).toMatch(/^BK-/);
    expect(res.body.appointment.queue_token).toMatch(/^LL-/);
    expect(res.body.prediction.estimatedWaitMinutes).toBeDefined();
  });

  it('Should reject booking when appointment slot is fully booked (409)', async () => {
    const office = inMemoryDB.findAll('rto_offices')[0];
    const service = inMemoryDB.findAll('services')[1];
    const fullSlot = inMemoryDB.insert('appointment_slots', {
      office_id: office.id,
      service_id: service.id,
      slot_date: new Date().toISOString().split('T')[0],
      start_time: '16:00:00',
      end_time: '17:00:00',
      max_capacity: 2,
      booked_count: 2, // FULL
      is_active: true
    });

    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', 'Bearer demo-citizen-token')
      .send({
        office_id: office.id,
        service_id: service.id,
        slot_id: fullSlot.id
      });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('SLOT_FULL');
  });

  // 6. Queue State Lifecycle Transitions
  it('Should advance queue state lawfully and block invalid transitions', async () => {
    const waitingAppt = inMemoryDB.findOne('appointments', a => a.status === 'waiting');
    expect(waitingAppt).toBeDefined();

    // Lawful transition: waiting -> in_progress
    const advanceRes = await request(app)
      .patch(`/api/admin/appointments/${waitingAppt.id}/status`)
      .set('Authorization', 'Bearer demo-admin-token')
      .send({ status: 'in_progress' });

    expect(advanceRes.status).toBe(200);
    expect(advanceRes.body.appointment.status).toBe('in_progress');
    expect(advanceRes.body.appointment.service_started_at).toBeDefined();

    // Unlawful transition: in_progress -> waiting (cannot move backwards)
    const invalidRes = await request(app)
      .patch(`/api/admin/appointments/${waitingAppt.id}/status`)
      .set('Authorization', 'Bearer demo-admin-token')
      .send({ status: 'waiting' });

    expect(invalidRes.status).toBe(400);
  });

  // 7. Predictive Wait-Time Engine Unit Calculations
  it('PredictionService calculates wait time with explainable breakdown and confidence bounds', () => {
    const office = inMemoryDB.findAll('rto_offices')[0];
    const service = inMemoryDB.findAll('services')[0]; // DL

    const pred = PredictionService.calculateWaitTime({
      officeId: office.id,
      serviceId: service.id,
      queuePosition: 2
    });

    expect(pred.estimatedWaitMinutes).toBeGreaterThan(0);
    expect(pred.lowerBoundMinutes).toBeLessThanOrEqual(pred.estimatedWaitMinutes);
    expect(pred.upperBoundMinutes).toBeGreaterThanOrEqual(pred.estimatedWaitMinutes);
    expect(pred.factorsUsed.effectiveDurationMinutes).toBeDefined();
    expect(pred.explanation).toBeDefined();
    expect(pred.dataBasis).toBeDefined();
  });

  // 8. Smart Slot Recommendations
  it('RecommendationService should exclude full slots and produce Lowest Wait, Balanced, and Convenient options', () => {
    const office = inMemoryDB.findAll('rto_offices')[0];
    const service = inMemoryDB.findAll('services')[0];

    const result = RecommendationService.getSlotRecommendations({
      officeId: office.id,
      serviceId: service.id
    });

    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.lowestWait).toBeDefined();
    expect(result.recommendations.balanced).toBeDefined();
    expect(result.recommendations.mostConvenient).toBeDefined();
    expect(result.recommendations.lowestWait.slot.isFull).toBe(false);
  });

  // 9. Workload Balancing Recommendations
  it('WorkloadService generates recommendations respecting counter service authorization', () => {
    const office = inMemoryDB.findAll('rto_offices')[0];
    const recs = inMemoryDB.findAll('counter_recommendations');
    expect(recs.length).toBeGreaterThan(0);

    const rec = recs[0];
    expect(rec.status).toBe('pending');
    expect(rec.expected_wait_reduction_minutes).toBeGreaterThan(0);

    // Admin approves recommendation
    const approved = WorkloadService.approveRecommendation(rec.id, {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'admin@smartqueue.demo'
    });

    expect(approved.status).toBe('approved');

    // Audit log created
    const auditLogs = inMemoryDB.findAll('audit_logs', l => l.action === 'APPROVE_COUNTER_REASSIGNMENT');
    expect(auditLogs.length).toBe(1);
  });

  // 10. Prediction Accuracy & Demonstration Seeder
  it('Prediction Evaluation handles insufficient observations cleanly and computes MAE/MAPE with synthetic data', () => {
    // Clean seed has 3 completed records (< 5)
    const initialEval = AnalyticsService.getPredictionEvaluation();
    expect(initialEval.sufficientData).toBe(false);
    expect(initialEval.message).toContain('Not enough completed observations');

    // Seed synthetic observations
    AnalyticsService.seedSyntheticDemoData(25);

    const fullEval = AnalyticsService.getPredictionEvaluation();
    expect(fullEval.sufficientData).toBe(true);
    expect(fullEval.meanAbsoluteErrorMinutes).toBeGreaterThan(0);
    expect(fullEval.meanAbsolutePercentageErrorPercent).toBeGreaterThan(0);
    expect(fullEval.evaluatedObservationsCount).toBeGreaterThanOrEqual(25);
  });
});
