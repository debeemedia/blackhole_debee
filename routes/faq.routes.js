
const express = require('express')
const { ROUTE_FAQ_CREATE, ROUTE_FAQ_UPDATE, ROUTE_FAQ_GET, ROUTE_FAQ_DELETE } = require('../lib/page-route')
const { addQuestion, updateFaq, deleteFaq, getQuestions } = require('../controllers/faq.controller')
const router = express.Router()


router.post(ROUTE_FAQ_CREATE, addQuestion)
router.put(ROUTE_FAQ_UPDATE, updateFaq)
router.delete(ROUTE_FAQ_DELETE, deleteFaq)
router.get(ROUTE_FAQ_GET, getQuestions)


exports.faqRouter = router