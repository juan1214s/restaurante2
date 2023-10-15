<?php
//habilitar cors 
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    die();
}


//llamamos el archivo con los datos
//de la conexion a la BD
require_once("db.php");

//usamos la clase mysli para conectarnos a la BD
$con = new mysqli($host, $user, $password, $bd);

//verificar si no hay errores en la conexion
if ($con->connect_error) {
    die("Conexion Fallida " . $con->connect_error);
}

//obtener los datos de la tabla pedidos
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    //realizar consulta a la BD
    $sql = "SELECT * FROM pedidos";
    //obtener resultados de la consulta a la tabla
    $resultado = $con->query($sql);
    //comprabar si la tabla no esta vacia
    if ($resultado->num_rows > 0) {
        //convertir los datos en un array asociativo
        //equivalente a un objeto en Javascript
        $pedidos = array();
        while ($row =  $resultado->fetch_assoc()) {
            $pedidos[] = $row;
        }
        //mostrar los datos
        //convertir los datos a formato JSON
        echo json_encode($pedidos);
    } else {
        //si no hay datos en la consulta
        echo "No hay datos en la Tabla";
    }
}

// Ruta para actualizar un pedido (PUT)
if ($_SERVER["REQUEST_METHOD"] == 'PUT') {
    // Recibe los datos del formulario
    $datosRecibidos = json_decode(file_get_contents('php://input'), true);

    // Obtén el ID del pedido y el nuevo estado
    $id = $datosRecibidos['id_pedido'];
    $estado = $datosRecibidos['estado'];


    // Actualiza el estado del pedido en la base de datos
    $sql = "UPDATE pedidos SET estado = '$estado' WHERE id_pedido = $id";

    if ($con->query($sql) === TRUE) {
        echo "Pedido Entregado.";
    } else {
        http_response_code(400);
        echo "Pedido no entregado: " . $con->error;
    }
}

//insertar datos en la tabla pedidos o la consulta de un pedido
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // echo json_encode("Recibi los datos");
    //recibir los datos del formulario
    $datosRecibidos = json_decode(file_get_contents('php://input'), true);
    //comprar si los datos recibidos es un array
    if (is_array($datosRecibidos)) {
        //sacar los datos del array
        $platillo = $datosRecibidos['platillo'];
        $cantidad = $datosRecibidos['cantidad'];
        $cliente = $datosRecibidos['cliente'];
        $precio = $datosRecibidos['precio'];
        $observaciones = $datosRecibidos['observaciones'];
        $estado = $datosRecibidos['estado'];

        //realizar el comando de insertar en la BD
        $sql = "INSERT INTO pedidos VALUES (NULL, '$platillo','$cantidad','$cliente','$precio','$observaciones','$estado')";
        //realizar el insert en la BD
        if ($con->query($sql) == TRUE) {
            http_response_code(201);
            echo json_encode("Pedido creado exitosamente.");
        } else {
            http_response_code(400);
            echo json_encode("Error al crear el pedido. " . $con->error);
        }
    } else {
        //sacar el id
        $id = $datosRecibidos;
        //realizar consulta a la BD
        $sql = "SELECT * FROM pedidos WHERE id_pedido = '$id'";
        //obtener resultados de la consulta a la tabla
        $resultado = $con->query($sql);
        //comprabar si la tabla no esta vacia
        if ($resultado->num_rows > 0) {
            $fila =  $resultado->fetch_assoc();
            //convertir los datos a formato JSON
            echo json_encode($fila);
        } else {
            //si no hay datos en la consulta
            echo "No se encontro el pedido";
        }
    }
}


// Ruta para eliminar un producto (DELETE)


// Cierra la conexión a la base de datos
$con->close();
