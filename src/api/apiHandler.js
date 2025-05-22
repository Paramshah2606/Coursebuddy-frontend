import { secureAxios } from "./api_func";
import { secureFetch } from "./api_func";
const baseurl=process.env.NEXT_PUBLIC_APP_URL;

export async function signup(data) {
  return secureAxios(`${baseurl}/api/v1/user/signup`,"POST",data);
}

export async function signin(data) {
  return secureAxios(`${baseurl}/api/v1/user/login`,"POST",data);
}

export async function getCategories() {
  return secureAxios(`${baseurl}/api/v1/user/categories/get`,"GET");
}

export async function addCourse(data) {
  return secureAxios(`${baseurl}/api/v1/user/course/add`,"POST",data);
}

export async function getCourses(data){
  return secureAxios(`${baseurl}/api/v1/user/course/get`,"POST",data);
}

export async function getCourseById(id){
  return secureAxios(`${baseurl}/api/v1/user/course/${id}`,"GET");
}

export async function buyCourse(data){
  return secureAxios(`${baseurl}/api/v1/user/course/buy`,"POST",data);
}

export async function getSubscription(){
  return secureAxios(`${baseurl}/api/v1/user/course/subscription`,"GET");
}

export async function addLesson(data) {
  return secureAxios(`${baseurl}/api/v1/user/lesson/add`,"POST",data);
}

export async function markLesson(data) {
  return secureAxios(`${baseurl}/api/v1/user/lesson/mark`,"POST",data);
}

export async function getMarkedLesson() {
  return secureAxios(`${baseurl}/api/v1/user/lesson/mark/get`,"GET");
}

export async function getUsers(){
  return secureAxios(`${baseurl}/api/v1/user/users/get`,"GET");
}

export async function getUserCourseProgress(data){
  return secureAxios(`${baseurl}/api/v1/user/courseProgress/get`,"POST",data);
}

export async function createCheckout(data){
  return secureAxios(`${baseurl}/api/v1/payment/create-checkout-session`,"POST",data);
}

export async function fetchSessionData(data) {
  return secureAxios(`${baseurl}/api/v1/payment/session-details`,"POST",data);
}