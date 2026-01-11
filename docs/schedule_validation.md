# Pipeline Schedule Validation Logic

## 1. TypeScript Validation Logic

We have implemented a strict validation helper `validateSchedulePayload` in the backend controller (`zylo.controller.ts`). This ensures that the schedule configuration strictly adherence to the business rules before reaching the database.

```typescript
const validateSchedulePayload = (
  mode: string,
  body: any,
): { valid: boolean; config: ScheduleConfig | null; error?: string } => {
  if (mode === 'manual') {
    // Rule: schedule_config must be NULL for manual execution
    return { valid: true, config: null };
  }

  if (mode === 'scheduled') {
    const { timezone, scheduleFrequency, cronExpression, intervalMinutes, startAt, endAt } = body;

    // Rule: Timezone is mandatory for scheduled execution
    if (!timezone) {
      return {
        valid: false,
        config: null,
        error: 'Timezone is required for scheduled execution.',
      };
    }

    // Rule: Frequency specific validation
    if (scheduleFrequency === 'cron') {
      if (!cronExpression) {
        return {
          valid: false,
          config: null,
          error: 'Cron expression is mandatory for cron frequency.',
        };
      }
    } else if (scheduleFrequency === 'interval') {
      if (!intervalMinutes) {
        return {
          valid: false,
          config: null,
          error: 'Interval minutes are mandatory for interval frequency.',
        };
      }
    } else {
      return {
        valid: false,
        config: null,
        error: 'Invalid or missing schedule frequency.',
      };
    }

    // Construct valid configuration object, stripping undefined fields
    const config: ScheduleConfig = {
      timezone,
      frequency: scheduleFrequency,
      cronExpression: scheduleFrequency === 'cron' ? cronExpression : undefined,
      intervalMinutes: scheduleFrequency === 'interval' ? intervalMinutes : undefined,
      startAt,
      endAt,
    };
    return { valid: true, config };
  }

  return { valid: false, config: null, error: 'Invalid execution mode.' };
};
```

## 2. Example Valid Payloads

### Manual Pipeline

When `executionMode` is `manual`, any schedule fields sent in the payload are ignored, and `schedule_config` is stored as `NULL`.

```json
{
  "pipelineName": "My Manual Pipeline",
  "executionMode": "manual",
  "sourceType": "upload",
  "timezone": "UTC",
  "scheduleFrequency": "cron",
  "cronExpression": "0 0 * * *"
  // Note: timezone, frequency, etc. above are ignored and stripped
}
```

### Scheduled Pipeline (Cron)

```json
{
  "pipelineName": "Daily Report",
  "executionMode": "scheduled",
  "timezone": "America/New_York",
  "scheduleFrequency": "cron",
  "cronExpression": "0 9 * * *",
  "sourceType": "upload"
}
```

### Scheduled Pipeline (Interval)

```json
{
  "pipelineName": "Hourly Sync",
  "executionMode": "scheduled",
  "timezone": "UTC",
  "scheduleFrequency": "interval",
  "intervalMinutes": 60,
  "startAt": "2023-10-27T00:00:00Z",
  "endAt": "2023-12-31T23:59:59Z",
  "sourceType": "upload"
}
```

## 3. Prevention of PostgreSQL CHECK Constraint Violations

Database schemas often enforce data integrity using CHECK constraints. A typical constraint for this scenario would look like:

```sql
CONSTRAINT check_schedule_config CHECK (
  (execution_mode = 'manual' AND schedule_config IS NULL) OR
  (execution_mode = 'scheduled' AND schedule_config IS NOT NULL)
)
```

**How our logic prevents violations:**

1.  **Manual Mode**: The validation logic explicitly returns `config: null` when `executionMode === 'manual'`. We then use this `null` value in the `INSERT` or `UPDATE` SQL query. This satisfies the `execution_mode = 'manual' AND schedule_config IS NULL` part of the constraint. Any stray schedule data from the frontend is stripped away, ensuring we never attempt to insert a non-null object for a manual pipeline.

2.  **Scheduled Mode**: The validation logic guarantees that if `executionMode === 'scheduled'`, we produce a valid, non-null `ScheduleConfig` object (ensuring required fields like timezone and frequency details are present). This satisfies the `execution_mode = 'scheduled' AND schedule_config IS NOT NULL` part of the constraint.

By handling this strictly at the application controller level, we prevent `IntegrityError` or constraint violations from ever reaching the database layer, providing clear feedback to the API consumer instead.
