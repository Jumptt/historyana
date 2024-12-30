import openai
import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# .envファイルから環境変数を読み込む
load_dotenv()

# history.txtの内容を読み込む
with open('history.txt', 'r', encoding='utf-8') as file:
    history_content = file.read()

# OpenAI APIキーを環境変数から取得
openai_api_key = os.getenv('OPENAI_API_KEY')

# OpenAI APIキーを設定
openai.api_key = openai_api_key

# OpenAIのクライアントを初期化

# Gmailの設定
smtp_server = "smtp.gmail.com"
smtp_port = 587
sender_email = os.getenv('GMAIL_ADDRESS')
sender_password = os.getenv('GMAIL_PASSWORD')
recipient_email = os.getenv('RECIPIENT_ADDRESS')  # 送信先のメールアドレスを設定

# メールの内容を作成
msg = MIMEMultipart()
msg['From'] = sender_email
msg['To'] = recipient_email
msg['Subject'] = "Browsing History Analysis"
analysis_result='test'
# メールの本文を追加
msg.attach(MIMEText(analysis_result, 'plain'))

# メールを送信
try:
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, msg.as_string())
        print("Email sent successfully")
except Exception as e:
    print(f"Failed to send email: {e}")