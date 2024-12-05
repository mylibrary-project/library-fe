export default function errorDisplay(err) {
  if (err.code === "ECONNABORTED") {
    console.log("응답시간 초과");
  } else if (err.response) {
    console.log("서버에러");
    console.log(err.response.status);
    console.log(err.response.data);
    console.log(err);
  } else if (err.request) {
    console.log("클라이언트 오류");
    console.log(err.message);
  } else {
    console.log(err.message);
  }
}
