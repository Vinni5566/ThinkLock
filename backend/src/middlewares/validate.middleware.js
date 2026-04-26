import ApiError from "../utils/ApiError.js";

/**
 * Higher-order middleware for Zod validation
 * @param {z.ZodSchema} schema 
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
    });

    if (!result.success) {
        const errorMessage = result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ");
        return next(new ApiError(400, errorMessage));
    }

    // Replace req with validated data (optional, but good for type safety)
    Object.assign(req, result.data);
    return next();
};

export default validate;
