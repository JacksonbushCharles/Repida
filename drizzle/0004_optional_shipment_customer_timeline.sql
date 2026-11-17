ALTER TABLE "shipment"
ALTER COLUMN "customerId" DROP NOT NULL;

DO $$
DECLARE
  customer_fk RECORD;
BEGIN
  FOR customer_fk IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = '"shipment"'::regclass
      AND contype = 'f'
      AND confrelid = '"user"'::regclass
      AND conkey = ARRAY[(
        SELECT attnum
        FROM pg_attribute
        WHERE attrelid = '"shipment"'::regclass
          AND attname = 'customerId'
      )]::smallint[]
  LOOP
    EXECUTE format('ALTER TABLE "shipment" DROP CONSTRAINT %I', customer_fk.conname);
  END LOOP;
END $$;

ALTER TABLE "shipment"
ADD CONSTRAINT "shipment_customerId_user_id_fk"
FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE SET NULL;

ALTER TABLE "tracking_event"
ADD COLUMN IF NOT EXISTS "checkpointStatus" TEXT NOT NULL DEFAULT 'COMPLETED',
ADD COLUMN IF NOT EXISTS "eventAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE "tracking_event"
SET "eventAt" = "createdAt"
WHERE "eventAt" <> "createdAt";

CREATE INDEX IF NOT EXISTS "tracking_event_shipment_event_at_idx"
ON "tracking_event" ("shipmentId", "eventAt");
