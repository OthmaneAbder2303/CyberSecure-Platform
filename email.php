<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("location: login.html");
    exit;
}
?>
<!DOCTYPE html>
<html>

<head>
  <!-- Basic -->
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!-- Mobile Metas -->
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <!-- Site Metas -->
  <meta name="keywords" content="" />
  <meta name="description" content="" />
  <meta name="author" content="" />

  <title>CypherTrust Technologies</title>

  <!-- slider stylesheet -->
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" />
  <!-- bootstrap core css -->
  <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
  <!-- font awesome style -->
  <link rel="stylesheet" type="text/css" href="css/font-awesome.min.css" />

  <!-- Custom styles for this template -->
  <link href="css/style.css" rel="stylesheet" />
  <!-- responsive style -->
  <link href="css/responsive.css" rel="stylesheet" />
  <link rel="stylesheet" href="css/style-email.css">

</head>

<body>
    <div class="hero_area">
        <!-- header section strats -->
        <header class="header_section">
          <div class="header_bottom">
            <div class="container-fluid">
              <nav class="navbar navbar-expand-lg custom_nav-container ">
                <a class="navbar-brand" href="index.php">
                  <span>
                    CypherTrust Technologies
                  </span>
                </a>
    
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class=""> </span>
                </button>
    
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav ">
                    <li class="nav-item ">
                      <a class="nav-link" href="index.php">Home </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="about.php"> About</a>
                    </li>
                    <li class="nav-item active">
                      <a class="nav-link" href="service.php">Services <span class="sr-only">(current)</a>
                    </li>
                    <li class="nav-item">
                      <?php
                    if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
                        echo '<a class="nav-link" href="deconnecte.php">'.htmlspecialchars($_SESSION["full_name"]) .'</a>';
                    } else {
                        echo '<a class="nav-link" href="login.html">Login</a>';
                    }
                    ?>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </header>
        <!-- end header section -->
    </div>


    <h1>S/MIME Certificate Generation</h1>
    <form id="certForm" action="/generate-cert" method="POST" enctype="multipart/form-data">
        <h2>Personal Information</h2>
        <label for="fullName">Full Name:</label>
        <input type="text" id="fullName" name="fullName" required><br>
        
        <label for="email">Email Address:</label>
        <input type="email" id="email" name="email" required><br>
        
        <label for="phone">Phone Number:</label>
        <input type="text" id="phone" name="phone" required><br>
        
        <h2>Organizational Information (if applicable)</h2>
        <label for="organization">Organization Name:</label>
        <input type="text" id="organization" name="organization"><br>
        
        <label for="department">Department/Division:</label>
        <input type="text" id="department" name="department"><br>
        
        <label for="jobTitle">Job Title:</label>
        <input type="text" id="jobTitle" name="jobTitle"><br>
        
        <h2>Address Details</h2>
        <label for="address">Physical Address:</label>
        <input type="text" id="address" name="address" required><br>
        
        <h2>Identification Documents</h2>
        <label for="idDocument">Government-issued ID:</label>
        <input type="file" id="idDocument" name="idDocument" required><br>
        
        <label for="proofOfAddress">Proof of Address:</label>
        <input type="file" id="proofOfAddress" name="proofOfAddress" required><br>
        
        <h2>Domain Ownership Verification (for organizational certificates)</h2>
        <label for="domainValidation">Domain Control Validation Method:</label>
        <select id="domainValidation" name="domainValidation">
            <option value="email">Email</option>
            <option value="dns">DNS</option>
            <option value="file">File-based</option>
        </select><br>
        
        <h2>Authorization Documents</h2>
        <label for="authorizationLetter">Letter of Authorization:</label>
        <input type="file" id="authorizationLetter" name="authorizationLetter"><br>
        
        <input type="submit" value="Generate Certificate">
    </form>

    <div id="certLinks" style="display: none;">
      <h2>Certificate Links</h2>
      <p>Certificate: <a id="certLink" href="#" target="_blank">Download Certificate</a></p>
      <p>Private Key: <a id="keyLink" href="#" target="_blank">Download Private Key</a></p>
      <p>Timestamp: <a id="timestampLink" href="#" target="_blank">Download Timestamp</a></p>
    </div>

    <h1>Send Encrypted Email</h1>
    <form id="emailForm" action="/send-email" method="POST">
        <label for="senderEmail">Your Email:</label>
        <input type="email" id="senderEmail" name="senderEmail" required><br>
        
        <label for="receiverEmail">Receiver's Email:</label>
        <input type="email" id="receiverEmail" name="receiverEmail" required><br>
        
        <label for="emailSubject">Subject:</label>
        <input type="text" id="emailSubject" name="emailSubject" required><br>
        
        <label for="emailContent">Email Content:</label>
        <textarea id="emailContent" name="emailContent" required></textarea><br>
        
        <input type="submit" value="Send Encrypted Email">
    </form>

    <div id="emailStatus" style="display: none;">
      <h2>Email Status</h2>
      <p id="emailMessage"></p>
    </div>

    <script>
      document.getElementById('certForm').addEventListener('submit', function(event) {
          event.preventDefault();
          const formData = new FormData(this);

          fetch('/generate-cert', {
              method: 'POST',
              body: formData
          })
          .then(response => response.json())
          .then(data => {
              document.getElementById('certLink').href = data.certDownloadLink;
              document.getElementById('keyLink').href = data.keyDownloadLink;
              document.getElementById('timestampLink').href = data.timestampDownloadLink;
              document.getElementById('certLinks').style.display = 'block';
          })
          .catch(error => console.error('Error:', error));
      });

      document.getElementById('emailForm').addEventListener('submit', function(event) {
          event.preventDefault();
          const formData = new FormData(this);

          fetch('/send-email', {
              method: 'POST',
              body: formData
          })
          .then(response => response.json())
          .then(data => {
              if (data.message) {
                  document.getElementById('emailMessage').textContent = data.message;
              } else {
                  document.getElementById('emailMessage').textContent = 'Unexpected response from server';
              }
              document.getElementById('emailStatus').style.display = 'block';
          })
          .catch(error => {
              document.getElementById('emailMessage').textContent = 'Error: ' + error.toString();
              document.getElementById('emailStatus').style.display = 'block';
          });
      });
    </script>



    <!-- footer section -->
  <footer class="footer_section">
    <div class="container">
      <p>
        &copy; <span id="displayDateYear"></span> All Rights Reserved By
        <a href="https://html.design/">CypherTrust Technologies</a>
      </p>
    </div>
  </footer>
  <!-- footer section -->

  <script src="js/jquery-3.4.1.min.js"></script>
  <script src="js/bootstrap.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js">
  </script>
  <script src="js/custom.js"></script>
  <!-- Google Map -->
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCh39n5U-4IoWpsVGUHWdqB6puEkhRLdmI&callback=myMap"></script>
  <!-- End Google Map -->


</body>

</html>