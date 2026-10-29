# Prediction Methodology & Algorithms: RTO SmartQueue AI

## 1. Mathematical Wait-Time Prediction Model

Rather than utilizing an opaque machine learning black-box or external LLM API, **RTO SmartQueue AI** implements an explainable, deterministic queueing theory model derived from operations research principles (extending classic $M/M/c$ multi-server queue models to heterogeneous, service-restricted multi-counter environments).

### 1.1 Effective Service Duration Calculation

Each RTO service $s$ has a configured baseline duration $D_{\text{base}}(s)$ (in minutes). When historical completed observations exist in the database, the engine computes a dynamically weighted effective service duration $D_{\text{eff}}(s)$:

$$D_{\text{eff}}(s) = \alpha \cdot \bar{D}_{\text{hist}}(s) + (1 - \alpha) \cdot D_{\text{base}}(s)$$

Where:
- $\bar{D}_{\text{hist}}(s)$ is the observed sample mean of completed appointments for service $s$ during the current or recent operating windows.
- $N(s)$ is the count of completed observations for service $s$.
- $\alpha = \min\left(0.75, \frac{N(s)}{20}\right)$ is the empirical credibility factor. 
  - If $N(s) = 0$, $\alpha = 0$, fully relying on the configured baseline duration $D_{\text{base}}(s)$.
  - As observations grow toward $N \ge 20$, historical data is weighted up to $75\%$, retaining a $25\%$ stabilizing prior.

### 1.2 Multi-Counter Queue Estimation Formula

Let $c_{\text{active}}(s)$ be the number of currently active, online counters authorized to process service $s$.

If a citizen is at position $k$ in the waiting queue ($k \ge 1$), their waiting time comprises two components:
1. **Residual Service Time** of customers currently being served at authorized counters:
   $$W_{\text{residual}} = \sum_{j \in \text{ActiveCounters}(s)} \max\left(0, D_{\text{eff}}(s_j) - \text{elapsed}_j\right)$$
2. **Backlog Service Time** of customers ahead in queue ($i = 1, \dots, k-1$):
   $$W_{\text{backlog}} = \sum_{i=1}^{k-1} D_{\text{eff}}(s_i)$$

The aggregate estimated waiting time $\hat{W}(k)$ is distributed across the authorized active counters:

$$\hat{W}(k) = \begin{cases} 
0 & \text{if } k = 0 \text{ (next in line and a counter is free)} \\
\frac{W_{\text{residual}} + W_{\text{backlog}}}{c_{\text{active}}(s)} \cdot \beta_{\text{congestion}} & \text{if } c_{\text{active}}(s) \ge 1 \\
(W_{\text{residual}} + W_{\text{backlog}}) \times 1.5 & \text{if } c_{\text{active}}(s) = 0 \text{ (office bottleneck warning)}
\end{cases}$$

Where $\beta_{\text{congestion}}$ is a small variance damping multiplier:
$$\beta_{\text{congestion}} = 1.0 + 0.03 \cdot \min(10, \text{QueueLength})$$

### 1.3 Confidence Intervals and Bounds

Queue durations naturally exhibit variance due to document verification anomalies. We compute dynamic lower and upper bounds:

$$L = \max\left(1, \text{round}\left(\hat{W} \times (1 - \delta)\right)\right)$$
$$U = \max\left(L + 2, \text{round}\left(\hat{W} \times (1 + \delta) + 2\right)\right)$$

Where the uncertainty margin $\delta$ decreases as sample confidence increases:
$$\delta = \begin{cases} 
0.35 & \text{if } N < 5 \text{ (Low confidence, synthetic/baseline only)} \\
0.20 & \text{if } 5 \le N < 20 \text{ (Moderate confidence)} \\
0.12 & \text{if } N \ge 20 \text{ (High confidence, robust historical data)}
\end{cases}$$

### 1.4 Structured Prediction Output Schema

Every wait-time calculation returns a standard explainable payload:

```json
{
  "estimatedWaitMinutes": 18,
  "lowerBoundMinutes": 14,
  "upperBoundMinutes": 23,
  "confidenceScore": 0.82,
  "confidenceLabel": "High",
  "calculationTimestamp": "2026-10-29T22:50:00.000Z",
  "factorsUsed": {
    "queuePositionAhead": 3,
    "activeAuthorizedCounters": 2,
    "effectiveServiceDurationMinutes": 12.5,
    "configuredDurationMinutes": 15,
    "observedSampleMeanMinutes": 11.7,
    "sampleCount": 24,
    "congestionDampingMultiplier": 1.09
  },
  "explanation": "Based on 3 citizens ahead distributed across 2 active counters, with average service time of 12.5 minutes.",
  "dataBasis": "Weighted Historical Observations (75%) + Configured Prior (25%)"
}
```

---

## 2. Smart Slot Recommendation Engine

When a citizen books an appointment, all valid slots for the selected date are evaluated simultaneously.

### 2.1 Multi-Objective Slot Scoring

For each slot $t$, we compute:
1. **Available Capacity Ratio**: $R_{\text{cap}}(t) = \frac{\text{capacity}_{\text{max}} - \text{booked}_{\text{count}}}{\text{capacity}_{\text{max}}}$
2. **Slot Load Forecast**: $\hat{L}(t)$, based on historical demand for that slot hour.
3. **Predicted Slot Wait**: $\hat{W}_{\text{slot}}(t) = \hat{L}(t) \cdot \frac{D_{\text{eff}}(s)}{c_{\text{active}}(s)}$

A Composite Slot Score $S(t)$ is computed:
$$S(t) = 0.55 \cdot \left(1 - \frac{\hat{W}_{\text{slot}}(t)}{\max_j \hat{W}_{\text{slot}}(j) + 1}\right) + 0.35 \cdot R_{\text{cap}}(t) + 0.10 \cdot \text{PreferenceMatch}(t)$$

### 2.2 Recommendation Classification
The engine outputs three distinct options:
- **Lowest Predicted Wait**: The slot minimizing $\hat{W}_{\text{slot}}(t)$ among non-full slots.
- **Balanced Option**: The slot maximizing $S(t)$, balancing low wait time with healthy remaining capacity.
- **Most Convenient**: The earliest morning (09:00 - 12:00) or afternoon (13:00 - 16:00) slot that still has available capacity.

---

## 3. Adaptive Counter Workload Optimization

The workload balancer executes on demand or whenever queue lengths exceed operational thresholds.

### 3.1 Congestion Detection Metric
A counter $c$ is marked **Congested** if:
$$\text{QueueSize}(c) > 4 \quad \text{OR} \quad \text{PredictedWait}(c) > 35\text{ minutes}$$

A counter $c'$ is marked **Underutilized** if:
$$\text{Status}(c') = \text{'active'} \quad \text{AND} \quad \text{QueueSize}(c') \le 1$$

### 3.2 Authorization & Feasibility Check
A counter reassignment recommendation is generated only if:
1. $c'$ is active and not currently congested.
2. $c'$ has staff certified or authorized for service $s$ (`counter_services` association exists).
3. The reassignment would reduce estimated waiting time at counter $c$ by at least 15% ($\Delta W \ge 5$ minutes).

### 3.3 Transactional Approval Workflow
1. The engine posts a row to `counter_recommendations` with status `pending`.
2. The Administrator reviews the recommendation on the Operations Insights page.
3. Upon clicking **Approve**:
   - The backend runs an atomic transaction updating counter assignments or adding authorized service support.
   - Associated queue wait times are refreshed immediately.
   - An immutable record is created in `audit_logs`.

---

## 4. Prediction Evaluation & Accuracy Analytics

To validate the model empirically, every appointment records:
- Snapshot of $\hat{W}$ at check-in.
- Actual service start timestamp $T_{\text{start}}$ and check-in timestamp $T_{\text{checkin}}$.
- Observed actual waiting time: $W_{\text{actual}} = \frac{T_{\text{start}} - T_{\text{checkin}}}{60\text{ seconds}}$.

### 4.1 Evaluation Metrics

For all completed appointments where $W_{\text{actual}}$ is observed:

$$\text{Mean Absolute Error (MAE)} = \frac{1}{n} \sum_{i=1}^n \left| \hat{W}_i - W_{\text{actual}, i} \right|$$

$$\text{Mean Absolute Percentage Error (MAPE)} = \frac{1}{m} \sum_{i \in \{i \mid W_{\text{actual}, i} > 0\}} \frac{\left| \hat{W}_i - W_{\text{actual}, i} \right|}{W_{\text{actual}, i}} \times 100\%$$

### 4.2 Handling Cold Start & Synthetic Demo Data
- When $n < 5$, the interface states:
  > *"Not enough completed observations to evaluate prediction accuracy yet (minimum 5 required)."*
- A dedicated synthetic demo generator allows one-click seeding of 30 realistic completed observations for live viva demonstrations, clearly flagged with `dataBasis = 'Synthetic Academic Demonstration Data'`.
