<?php
require_once "session.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
</head>
<body>
    <h1>Welcome, <?php echo htmlspecialchars($_SESSION["email"]); ?>!</h1>
    <p>
        <a href="deconnecte.php">Logout</a>
    </p>
</body>
</html>
