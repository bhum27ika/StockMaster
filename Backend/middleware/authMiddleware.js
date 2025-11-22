// Simple auth middleware placeholder.
// Replace with real JWT validation if you add auth.
export default function authMiddleware(req, res, next) {
  // if you store token in Authorization header: 'Bearer <token>'
  // Implement real verification here.
  req.user = { id: null }; // placeholder
  next();
}
