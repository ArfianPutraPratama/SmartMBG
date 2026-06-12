<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verifikasi OTP SmartMBG</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #1a5632; /* Warna hijau SmartMBG */
            padding: 30px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            color: #333333;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        .otp-code {
            display: inline-block;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #1a5632;
            background-color: #e8f5e9;
            padding: 15px 30px;
            border-radius: 8px;
            margin: 20px 0;
            border: 2px dashed #1a5632;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #777777;
            border-top: 1px solid #eeeeee;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SmartMBG</h1>
        </div>
        <div class="content">
            <p>Halo,</p>
            <p>Terima kasih telah mendaftar di <strong>SmartMBG</strong>. Untuk menyelesaikan proses pendaftaran Anda, silakan gunakan kode verifikasi (OTP) berikut:</p>
            
            <div class="otp-code">{{ $otp }}</div>
            
            <p>Kode ini hanya berlaku selama <strong>10 menit</strong>. Jangan bagikan kode ini kepada siapa pun.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} SmartMBG. Seluruh hak cipta dilindungi.
        </div>
    </div>
</body>
</html>
