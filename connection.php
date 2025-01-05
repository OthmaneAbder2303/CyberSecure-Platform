<?php
$dsn = 'mysql:host=localhost;dbname=cyphertrust_users';
$username = 'root';
$passwordDB = '';

try {
    $pdo = new PDO($dsn, $username, $passwordDB);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
    exit;
}
?>
