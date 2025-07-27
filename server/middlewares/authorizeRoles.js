export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('🔐 Allowed Roles:', allowedRoles);
    console.log('🧑‍💼 req.user:', req.user);

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      console.log('❌ Forbidden: Role check failed');
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }

    console.log('✅ Role authorized');
    next();
  };
};
