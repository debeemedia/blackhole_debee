
exports.ROUTE_HOME = '/'


exports.ROUTE_USER_REGISTER = '/register'
exports.ROUTE_USER_DELETE = '/delete'
exports.ROUTE_USER_LOGIN = '/login'
exports.ROUTE_USER_LOGOUT = '/logout'
exports.ROUTE_USERS_GET = '/'
exports.ROUTE_USER_UPDATE = '/update'
exports.ROUTE_VERIFY = '/verify'
exports.ROUTE_FORGOT_PASS = '/forgot-password'
exports.ROUTE_RECOVER_PASS = '/recover_password'


exports.ROUTE_VENDOR_REGISTER = '/sell'
exports.ROUTE_TOKEN = '/token'


exports.ROUTE_CATEGORY_CREATE = '/create'
exports.ROUTE_CATEGORY_UPDATE = '/:categoryId/update'
exports.ROUTE_CATEGORY_DELETE = '/:categoryId/delete'
exports.ROUTE_CATEGORY_GET_ALL = '/'
exports.ROUTE_GET_PRODUCTS_BY_CATEGORY= '/:categoryId'


exports.ROUTE_PRODUCT_CREATE = '/create'
exports.ROUTE_PRODUCT_UPDATE = '/:productId/update'
exports.ROUTE_PRODUCT_DELETE = '/:productId/delete'
exports.ROUTE_PRODUCT_GET_ALL = '/'
exports.ROUTE_GET_PRODUCT= '/:productId'


exports.ROUTE_REVIEW_CREATE = '/:productId/create'
exports.ROUTE_REVIEW_UPDATE = '/:reviewId/update'
exports.ROUTE_REVIEW_DELETE = '/:reviewId/delete'
exports.ROUTE_REVIEW_GET_PRODUCT_REVIEWS = '/:productId'

exports.ROUTE_FAVORITE_ADD = '/add'
exports.ROUTE_FAVORITE_REMOVE = '/:favoriteId/remove'
exports.ROUTE_FAVORITE_GET = '/'


exports.ROUTE_FAQ_CREATE = '/create'
exports.ROUTE_FAQ_UPDATE = '/:faqId/update'
exports.ROUTE_FAQ_DELETE = '/:faqId/delete'
exports.ROUTE_FAQ_GET = '/'

exports.ROUTE_ORDER_CREATE = '/create'
exports.ROUTE_ORDER_ALL_BY_USER = '/'
exports.ROUTE_ORDER_ONE_BY_USER = '/:orderId'
exports.ROUTE_ORDER_ALL = '/?status=status'
exports.ROUTE_ORDER_DELIVERED = '/:orderId'

exports.ROUTE_PAYMENT_CREATE