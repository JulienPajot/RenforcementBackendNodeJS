const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Utilisateur non authentifié",
        });
      }

      if (!req.user.active) {
        return res.status(403).json({
          message: "Compte désactivé",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Accès refusé",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Erreur middleware rôle",
      });
    }
  };
};

module.exports = {
  authorizeRoles,
};