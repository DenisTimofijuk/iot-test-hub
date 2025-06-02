import Joi from 'joi';

// Device validation schema
export const deviceSchema = Joi.object({
    device_id: Joi.string().required().min(1).max(50),
    last_seen: Joi.number().integer().positive().required(),
    system: Joi.object({
        free_heap: Joi.number().integer().min(0).required(),
        wifi_connected: Joi.boolean().required(),
        sensors_ok: Joi.boolean().required(),
        uptime: Joi.number().integer().min(0).optional(),
        firmware_version: Joi.string().optional()
    }).required(),
    dht22_status: Joi.string().valid('ok', 'error', 'offline').optional(),
    ccs811_status: Joi.string().valid('ok', 'error', 'offline').optional(),
    location: Joi.object({
        room: Joi.string().optional(),
        building: Joi.string().optional(),
        coordinates: Joi.object({
            lat: Joi.number().min(-90).max(90).optional(),
            lng: Joi.number().min(-180).max(180).optional()
        }).optional()
    }).optional(),
    created_at: Joi.date().optional(),
    updated_at: Joi.date().optional()
});

// Reading validation schema
export const readingSchema = Joi.object({
    device_id: Joi.string().required().min(1).max(50),
    timestamp: Joi.date().required(),
    temperature: Joi.number().min(-50).max(100).optional(),
    humidity: Joi.number().min(0).max(100).optional(),
    co2_ppm: Joi.number().min(0).max(10000).optional(),
    tvoc_ppb: Joi.number().min(0).max(60000).optional(),
    pm25: Joi.number().min(0).max(1000).optional(),
    pm10: Joi.number().min(0).max(1000).optional(),
    pressure: Joi.number().min(800).max(1200).optional(),
    light_level: Joi.number().min(0).max(100000).optional(),
    battery_level: Joi.number().min(0).max(100).optional(),
    signal_strength: Joi.number().min(-120).max(0).optional()
});

// Batch readings validation schema
export const batchReadingsSchema = Joi.array().items(readingSchema).min(1).max(1000);

// Update schemas (partial validation)
export const deviceUpdateSchema = deviceSchema.fork(
    ['device_id', 'last_seen', 'system'], 
    schema => schema.optional()
);

export const readingUpdateSchema = readingSchema.fork(
    ['device_id', 'timestamp'], 
    schema => schema.optional()
);

// Query validation schemas
export const querySchema = Joi.object({
    limit: Joi.number().integer().min(1).max(1000).default(100),
    skip: Joi.number().integer().min(0).default(0),
    sort: Joi.string().valid('asc', 'desc', '1', '-1').default('desc'),
    sortBy: Joi.string().default('timestamp'),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    device_id: Joi.string().optional()
});

export const aggregationQuerySchema = Joi.object({
    device_id: Joi.string().optional(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    granularity: Joi.string().valid('minute', 'hour', 'day', 'week', 'month').default('hour'),
    metrics: Joi.array().items(
        Joi.string().valid('temperature', 'humidity', 'co2_ppm', 'tvoc_ppb', 'pm25', 'pm10')
    ).min(1).default(['temperature', 'humidity'])
});