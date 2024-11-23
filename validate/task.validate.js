module.exports.editPatch = (req, res, next) => {
    if(!req.body.title){
        return res.json({
            code: 400,
            message: "Vui lòng nhập tiêu đề "
        })
    }
    if(!req.body.status){
        return res.json({
            code: 400,
            message: "Vui lòng chọn trạng thái công việc"
        })
    }
    if(!req.body.content){
        return res.json({
            code: 400,
            message: "Vui lòng nhập  nội dung công việc"
        })
    }
    if(!req.body.timeStart){
        return res.json({
            code: 400,
            message: "Vui lòng chọn thời gian bắt đầu "
        })
    }
    if(!req.body.timeFinish){
        return res.json({
            code: 400,
            message: "Vui lòng chọn thời gian kết thúc"
        })
    }
    next();

}