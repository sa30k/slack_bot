// q1: 学籍番号, q2: 氏名, q3: 組, q4: レポートファイル

const slack_app_token = "";
const student_id_to_slack_id = {"": ""};
const folder_id = "";

function autoSlack(e) {
  const itemResponses = e.response.getItemResponses();
  
  // slack通知
  const student_id = itemResponses[0].getResponse();
  const name = itemResponses[1].getResponse();

  const body = name + "さん、第1回レポートを受け取りました。"
  
  const slack_id = student_id_to_slack_id[student_id];
  const channel_id = getChannelID_(slack_id);
  const options = {
    "method" : "post",
    "contentType": "application/x-www-form-urlencoded",
    "payload" : {
      "token": slack_app_token,
      "channel": channel_id,
      "text": body
    }
  };
  
  const url = 'https://slack.com/api/chat.postMessage';
  UrlFetchApp.fetch(url, options);

  // ファイルの名前を"学籍番号_氏名"に変更
  file = DriveApp.getFileById(itemResponses[3].getResponse());
  const ext = file.getName().match(/[^.]+$/);
  const fileName = student_id + '_' + name + '.' + ext;

  file.setName(fileName);

  // 保存フォルダ変更
  const folder = DriveApp.getFolderById(folder_id);
  file.moveTo(folder);
}

function getChannelID_(member_id) {
 
  const options = {
    "method" : "post",
    "contentType": "application/x-www-form-urlencoded",
    "payload" : {
      "token": slack_app_token,
      "users": member_id
    }
  }
  
  const url = 'https://slack.com/api/conversations.open';
  const response = UrlFetchApp.fetch(url, options);
  
  const obj = JSON.parse(response);
  console.log(obj)
}