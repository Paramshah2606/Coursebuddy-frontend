import { secureAxios } from "./api_func";
import { secureFetch } from "./api_func";

export async function signup(data) {
  return secureAxios("http://localhost:8080/api/v1/user/signup","POST",data);
}

export async function signin(data) {
  return secureAxios("http://localhost:8080/api/v1/user/login","POST",data);
}

export async function getCategories() {
  return secureAxios("http://localhost:8080/api/v1/user/categories/get","GET");
}

export async function addCourse(data) {
  return secureAxios("http://localhost:8080/api/v1/user/course/add","POST",data);
}

export async function getCourses(data){
  return secureAxios("http://localhost:8080/api/v1/user/course/get","POST",data);
}

export async function getCourseById(id){
  return secureAxios(`http://localhost:8080/api/v1/user/course/${id}`,"GET");
}

export async function buyCourse(data){
  return secureAxios("http://localhost:8080/api/v1/user/course/buy","POST",data);
}

export async function getSubscription(){
  return secureAxios("http://localhost:8080/api/v1/user/course/subscription","GET");
}

export async function addLesson(data) {
  return secureAxios("http://localhost:8080/api/v1/user/lesson/add","POST",data);
}

export async function markLesson(data) {
  return secureAxios("http://localhost:8080/api/v1/user/lesson/mark","POST",data);
}

export async function getMarkedLesson() {
  return secureAxios("http://localhost:8080/api/v1/user/lesson/mark/get","GET");
}

export async function getUsers(){
  return secureAxios("http://localhost:8080/api/v1/user/users/get","GET");
}

export async function getUserCourseProgress(data){
  return secureAxios("http://localhost:8080/api/v1/user/courseProgress/get","POST",data);
}

export async function createCheckout(data){
  return secureAxios("http://localhost:8080/api/v1/payment/create-checkout-session","POST",data);
}

export async function fetchSessionData(data) {
  return secureAxios("http://localhost:8080/api/v1/payment/session-details","POST",data);
}