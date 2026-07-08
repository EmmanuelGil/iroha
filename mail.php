<?php
// Forwards contact form submissions to the school inbox.
// Requires PHP hosting (does nothing on GitHub Pages).
header('Content-Type: application/json; charset=utf-8');

$to = 'fjls@fukuokaschool.com';

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');
$honey   = trim($_POST['_honey'] ?? '');

// Spam honeypot: bots fill the hidden field; pretend success and drop it.
if ($honey !== '') {
    echo '{"ok":true}';
    exit;
}

if ($name === '' || $message === '') {
    http_response_code(400);
    echo '{"ok":false}';
    exit;
}

// Never allow newlines in header-bound values (header injection).
$name    = str_replace(array("\r", "\n"), ' ', $name);
$email   = str_replace(array("\r", "\n"), ' ', $email);
$subject = str_replace(array("\r", "\n"), ' ', $subject);

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $email = '';
}

$title = $subject !== '' ? $subject : 'New message from the website';
$body  = "Name: $name\n"
       . "Email: $email\n"
       . "Subject: $subject\n\n"
       . "Message:\n$message\n";

$headers = "From: Iroha Website <no-reply@fukuokaschool.com>\r\n";
if ($email !== '') {
    $headers .= "Reply-To: $email\r\n";
}
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$ok = mail($to, '=?UTF-8?B?' . base64_encode($title) . '?=', $body, $headers);

http_response_code($ok ? 200 : 500);
echo $ok ? '{"ok":true}' : '{"ok":false}';
