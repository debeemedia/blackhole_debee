const { ComplaintModel } = require("../models/complaint.model");
const debeerandomgen = require("debeerandomgen");
const UserModel = require("../models/user.model");
const { buildEmailTemplate, sendMail } = require("../utils/mail");

async function makeComplaint(req, res) {
    try {
        const { id } = req.user;
        const user = await UserModel.findById(id);

        const { description, order_ref } = req.body;
        if (!description || !order_ref) {
            return res.json({
                success: false,
                message: `Please provide required fields`,
            });
        }

        const timestamp = Date.now().toString(36).slice(-4);
        const ticket_id = `${timestamp}${debeerandomgen(2)}`;

        const newComplaint = new ComplaintModel({
            description,
            order_ref,
            user_id: id,
            ticket_id,
        });
        await newComplaint.save();

        const details = { name: user.first_name, ticket_id };

        const emailOption = {
            to: user.email,
            from: "Aphia",
            subject: "Complaint Received",
            html: await buildEmailTemplate("complaint.ejs", details),
        };
        await sendMail(emailOption, res);

        res.json({
            success: true,
            message: `Your complaint has been recieved`,
        });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: `Internal Server Error` });
    }
}

async function markResolved(req, res) {
    try {
        const { message } = req.body;
        const ticket_id = req.params.ticketId;

        if (!message) {
            return res.json({
                success: false,
                message: `Please provide required field`,
            });
        }

        if (!ticket_id) {
            return res.json({
                success: false,
                message: `Please provide Ticket No`,
            });
        }

        const complaint = await ComplaintModel.findOne({ ticket_id });
        if (!complaint) {
            return res.json({ success: false, message: `Complaint not found` });
        }

        const user = await UserModel.findById(complaint.user_id);

        const details = { message, ticket_id, name: user.first_name };
        const emailOption = {
            to: user.email,
            from: "Aphia",
            subject: "Complaint Resolved",
            html: await buildEmailTemplate("resolve_complaint.ejs", details),
        };
        await sendMail(emailOption, res);

        complaint.resolved = true;
        await complaint.save();

        res.json({ success: true, message: `Complaint resolved successfully` });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: `Internal Server Error` });
    }
}


async function deleteComplaint(req, res) {
    try {
        const { deletedCount } = await ComplaintModel.deleteMany({ resolved: true });

        if (deletedCount > 0) {
            return res.json({
                success: true,
                message: `Successfully deleted ${deletedCount} resolved complaints.`,
            });
        } else {
            return res.json({
                success: true,
                message: 'No resolved complaints found for deletion.',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}


module.exports = {
    deleteComplaint,
    makeComplaint,
    markResolved
}