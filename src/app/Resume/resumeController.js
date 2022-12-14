const jwtMiddleware = require("../../../config/jwtMiddleware");
const resumeProvider = require("../../app/Resume/resumeProvider");
const resumeService = require("../../app/Resume/resumeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
/**
 *[GET] /app/resumes/:useridx
 *
 */
exports.getResumeByUser = async function (req, res) {
    const userIdx = req.params.useridx;
    const resumeUserResult = await resumeProvider.retrieveResume(userIdx);

    return res.send(response(baseResponse.SUCCESS, resumeUserResult));
}

// 이력서 생성
exports.postResumeByUser = async function (req, res) {
    const userIdx = req.params.useridx;

    /*const {title, name, email, phone, aboutMe, skill,  // Resume
        careerStart, careerEnd, company, workType, department, duty, careerIsCurrent, // ResumeCareer
        performance, performanceStart, performanceEnd, content, // ResumePerformance
        educationStart, educationEnd, school, major, finishClass, eduIsCurrent, // ResumeEducation
        prizeDate, activityName, activityDetail, // ResumePrize
        language, langClass, // ResumeLanguage
        testName, score, testDate, // ResumeLangTest
        link // ResumeLink
    } = req.body;*/

    const {title, name, email, phone, aboutMe, skill} = req.body;
    const postResumeParams = [userIdx, title, name, email, phone, aboutMe, skill];

    const postResumeResult = await resumeService.postResume(postResumeParams);
    return res.send(response(postResumeResult));
}

exports.postResumeCareer = async function(req, res) {
    const resumeIdx = req.params.resumeidx;
    const {careerStart, careerEnd, company, workType, department, duty, isCurrent} = req.body;
    const postResumeCareerParams = [resumeIdx, careerStart, careerEnd, company, workType, department, duty, isCurrent];
    const postResumeCareerResult = await resumeService.postResumeCareer(postResumeCareerParams)
    return res.send(response(postResumeCareerResult));
}

exports.postCareerPerformance = async function(req, res) {
    const resumeCareerIdx = req.params.resumecareeridx;
    const {performance, performanceStart, performanceEnd, content} = req.body;
    const careerPerformanceParams = [resumeCareerIdx, performance, performanceStart, performanceEnd, content];
    const postCareerPerformanceResult = await resumeService.postResumeCareerPerformance(careerPerformanceParams);
    return res.send(response(postCareerPerformanceResult));
}

exports.postResumeEducation = async function(req, res) {
    const resumeIdx = req.params.resumeidx;
    const {educationStart, educationEnd, school, major, finishClass, isCurrent} = req.body;
    const resumeEducationParams = [resumeIdx, educationStart, educationEnd, school, major, finishClass, isCurrent];
    const postResumeEducationResult = await resumeService.postResumeEducation(resumeEducationParams);
    return res.send(response(postResumeEducationResult));
}

exports.postResumeSkill = async function(req, res){
    const resumeIdx = req.params.resumeidx;
    let skill = req.body;
    skill = skill.skill;
    const resumeSkillParams = [resumeIdx, skill];
    const postResumeSkillResult = await resumeService.postResumeSkill(resumeSkillParams);
    return res.send(response(postResumeSkillResult));
}

exports.postResumePrize = async function(req, res){
    const resumeIdx = req.params.resumeidx;
    const {prizeDate, activityName, activityDetail} = req.body;
    const resumePrizeParams = [resumeIdx, prizeDate, activityName, activityDetail];
    const postResumePrizeResult = await resumeService.postResumePrize(resumePrizeParams);
    return res.send(response(postResumePrizeResult));
}

exports.postResumeLang = async function(req, res) {
    const resumeIdx = req.params.resumeidx;
    const {prizeDate, activityName, activityDetail} = req.body;
    const resumePrizeParams = [resumeIdx, prizeDate, activityName, activityDetail];
    const postResumePrizeResult = await resumeService.postResumePrize(resumePrizeParams);
    return res.send(response(postResumePrizeResult));
}

exports.postResumeLang = async function(req, res) {
    const resumeIdx = req.params.resumeidx;
    const {language, clas} = req.body;
    const resumeLangParams = [resumeIdx, language, clas];
    const postResumeLangResult = await resumeService.postResumeLang(resumeLangParams);
    return res.send(response(postResumeLangResult));
}

exports.postResumeLangtest = async function(req, res){
    const resumeLangIdx = req.params.resumelangidx;
    const {testName, score, testDate} = req.body;
    const resumeLangTestParams = [resumeLangIdx, testName, score, testDate];
    const postResumeLangTestResult = await resumeService.postResumeLangTest(resumeLangTestParams);
    return res.send(response(postResumeLangTestResult));
}

exports.postResumeLink = async function(req, res){
    const resumeIdx = req.params.resumeidx;
    let link = req.body;
    link = link.link;
    const resumeLinkParams = [resumeIdx, link];
    const postResumeLinkResult = await resumeService.postResumeLink(resumeLinkParams);
    return res.send(response(postResumeLinkResult));
}