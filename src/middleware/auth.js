
const isAuthorizedUser = (role) => {
    return (req, res, next) => {
        console.log(!role.includes('admin'));
        if(!(role.includes('admin') || role.includes('author'))){
            return res.status(403).json({message: `${req.user.email} do not have permission for this operation`})
        }
        next();
    }
}

module.exports = {isAuthorizedUser};