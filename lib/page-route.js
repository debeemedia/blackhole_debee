
exports.ROUTE_HOME = '/'


exports.ROUTE_USER_REGISTER = '/register'
exports.ROUTE_USER_LOGIN = '/login'
exports.ROUTE_USER_LOGOUT = '/logout'
exports.ROUTE_USERS_GET = '/'
exports.ROUTE_USER_UPDATE = '/update'
exports.ROUTE_USER_UPGRADE = '/upgrade'
exports.ROUTE_USER_DELETE = '/delete'
exports.ROUTE_VERIFY = '/verify'
exports.ROUTE_RESEND = '/resend'
exports.ROUTE_FORGOT_PASSWORD = '/forgot_password'
exports.ROUTE_RESET_PASSWORD = '/reset_password'


exports.ROUTE_VENDOR_REGISTER = '/sell'

exports.ROUTE_BANK_VERIFY = '/verify_bank'

exports.ROUTE_ADMIN_CHANGE_USER = '/:userId/user_to_admin'
exports.ROUTE_ADMIN_DELETE_USER = '/user/:userId/delete'
exports.ROUTE_ADMIN_VERIFY_USER = '/user/:userId/verify'
exports.ROUTE_ADMIN_DELETE_PRODUCT = '/product/:productId/delete'
exports.ROUTE_ADMIN_CATEGORY_CREATE = '/category/create'
exports.ROUTE_ADMIN_CATEGORY_UPDATE = '/category/:categoryId/update'
exports.ROUTE_ADMIN_CATEGORY_DELETE = '/category/:categoryId/delete'

exports.ROUTE_CATEGORY_GET_ALL = '/'
exports.ROUTE_GET_PRODUCTS_BY_CATEGORY= '/:categoryName'


exports.ROUTE_PRODUCT_CREATE = '/create'
exports.ROUTE_PRODUCT_UPDATE = '/:productId/update'
exports.ROUTE_PRODUCT_IMAGE_ADD = '/:productId/add_image'
exports.ROUTE_PRODUCT_IMAGE_REMOVE = '/:productId/remove_image'
exports.ROUTE_PRODUCT_DELETE = '/:productId/delete'
exports.ROUTE_PRODUCT_GET_ALL = '/'
exports.ROUTE_PRODUCT_GET_VENDOR = '/vendor'
exports.ROUTE_GET_PRODUCT= '/:productId'
exports.ROUTE_PRODUCT_SEARCH = '/search'


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
exports.ROUTE_ORDER_DELETE = '/:orderId/delete'
exports.ROUTE_ORDER_VENDOR_ORDERS = '/vendor'

exports.ROUTE_PAYMENT_WEBHOOK = '/webhook/flutterwave'
exports.ROUTE_PAYMENT_RETRY = '/retry/:orderId'
exports.ROUTE_PAYMENT_GET = '/:transactionId'

exports.ROUTE_FLASH_GET = '/'
exports.ROUTE_FLASH_ADD = '/add'
exports.ROUTE_FLASH_REMOVE = '/remove'