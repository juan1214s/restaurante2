<?php
include("conexion/db.php");

$con = new mysqli($host, $user, $password, $bd);
// Obtener las credenciales del formulario (suponiendo que se envían por POST)
$usuario = $_POST['user'];
$pass = $_POST['password'];

// Realizar la consulta SQL para verificar las credenciales
$consulta = "SELECT tipo_usuario FROM usuarios WHERE nombre='$usuario' AND contrasena='$pass'";
$resultado = mysqli_query($con, $consulta);

if ($fila = mysqli_fetch_assoc($resultado)) {
    $tipoUsuario = $fila['tipo_usuario'];
    
    if ($tipoUsuario === "mesero") {
        header("location: entregas_mesero.html");
    } elseif ($tipoUsuario === "chef") {
        header("location: pedidos_chef.html");
    } elseif ($tipoUsuario === "cajero") {
        header("location: index.html");
    } else {
        include("inicioSeccion.html");
        echo '<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>';
        echo '<script>';
        echo 'swal("ERROR AL INICIAR SESIÓN", "Vuelve e ingresa tu Usuario", "error");';
        echo '</script>';
        exit;
    }
} else {
    include("inicioSeccion.html");
    echo '<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>';
    echo '<script>';
    echo 'swal("ERROR AL INICIAR SESIÓN", "Vuelve e ingresa tu Usuario", "error");';
    echo '</script>';
    exit;
}

 ?>
