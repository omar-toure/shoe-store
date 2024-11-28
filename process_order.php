<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Données invalides']);
        exit;
    }

    // Validation des données
    if (empty($data['customerName']) || empty($data['customerEmail']) || empty($data['customerPhone']) || empty($data['items'])) {
        echo json_encode(['success' => false, 'message' => 'Informations manquantes']);
        exit;
    }

    try {
        // Démarrer une transaction
        mysqli_begin_transaction($conn);

        // Insérer la commande
        $sql = "INSERT INTO orders (customer_name, customer_email, customer_phone, total_amount) VALUES (?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        
        $totalAmount = array_reduce($data['items'], function($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);

        mysqli_stmt_bind_param($stmt, "sssi", 
            $data['customerName'],
            $data['customerEmail'],
            $data['customerPhone'],
            $totalAmount
        );
        
        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception("Erreur lors de l'enregistrement de la commande");
        }

        $orderId = mysqli_insert_id($conn);

        // Insérer les détails de la commande
        $sql = "INSERT INTO order_details (order_id, product_id, quantity, size, price) VALUES (?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);

        foreach ($data['items'] as $item) {
            mysqli_stmt_bind_param($stmt, "iiisi",
                $orderId,
                $item['id'],
                $item['quantity'],
                $item['size'],
                $item['price']
            );
            
            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception("Erreur lors de l'enregistrement des détails de la commande");
            }
        }

        // Valider la transaction
        mysqli_commit($conn);

        // Envoyer un email de confirmation au client
        $to = $data['customerEmail'];
        $subject = "Confirmation de commande - ShoeStore Sénégal";
        $message = "
            Cher(e) {$data['customerName']},
            
            Nous vous remercions pour votre commande n°{$orderId}.
            
            Récapitulatif de votre commande :
            Total : " . number_format($totalAmount, 0, ',', ' ') . " FCFA
            
            Nous vous contacterons bientôt au {$data['customerPhone']} pour organiser la livraison.
            
            Cordialement,
            L'équipe ShoeStore Sénégal
        ";
        $headers = "From: contact@shoestore.sn";

        mail($to, $subject, $message, $headers);

        // Envoyer une notification à l'administrateur
        $admin_email = "toure.omar811@gmail.com";
        $admin_subject = "Nouvelle commande - ShoeStore Sénégal";
        $admin_message = "
            Nouvelle commande n°{$orderId}
            
            Détails du client :
            Nom : {$data['customerName']}
            Email : {$data['customerEmail']}
            Téléphone : {$data['customerPhone']}
            
            Articles commandés :
        ";

        foreach ($data['items'] as $item) {
            $admin_message .= "
            - {$item['name']} (Pointure: {$item['size']})
              Quantité: {$item['quantity']}
              Prix unitaire: " . number_format($item['price'], 0, ',', ' ') . " FCFA
              Sous-total: " . number_format($item['price'] * $item['quantity'], 0, ',', ' ') . " FCFA
            ";
        }

        $admin_message .= "
            
            Total de la commande : " . number_format($totalAmount, 0, ',', ' ') . " FCFA
            
            Cette commande nécessite votre attention.
        ";

        $admin_headers = "From: noreply@shoestore.sn\r\n";
        $admin_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        mail($admin_email, $admin_subject, $admin_message, $admin_headers);

        echo json_encode([
            'success' => true,
            'message' => 'Commande enregistrée avec succès',
            'orderId' => $orderId
        ]);

    } catch (Exception $e) {
        mysqli_rollback($conn);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }

} else {
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée'
    ]);
}

mysqli_close($conn);
?>
