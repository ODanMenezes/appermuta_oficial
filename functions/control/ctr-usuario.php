<script type="module">
    () => {
        var Usuario = require('../model/Usuario.js');
    

        let nome_php = "<?php echo json_encode($nome); ?>";
        let sobrenome_php = "<?php echo json_encode($sobrenome); ?>"; 
        let dataNasc_php = "<?php echo json_encode($dataNasc); ?>"; 
        let cpf_php = "<?php echo json_encode($cpf); ?>"; 
        let rg_php = "<?php echo json_encode($rg); ?>";
        let email_php = "<?php echo json_encode($email); ?>"; 
        let senha_php = "<?php echo json_encode($senha); ?>";

        debug_to_console($nome);
        
        /*Endereço*/
        let logadouro_php = "<?php echo json_encode($logadouro); ?>"; 
        let numCasa_php = <?php echo json_encode($numCasa); ?>;
        let complemento_php = "<?php echo json_encode($complemento); ?>"; 
        let bairro_php = "<?php echo json_encode($bairro); ?>"; 
        let cep_php = "<?php echo json_encode($cep); ?>";
        
        let endereco_php = {
            logadouro: logadouro_php,
            numCasa: numCasa_php,
            complemento: complemento_php,
            bairro: bairro_php,
            cep: cep_php
        }

        let objUsuario = new Usuario(nome_php, sobrenome_php, dataNasc_php, cpf_php, rg_php, email_php, senha_php, endereco_php);
        objUsuario.inserirUsuario(objUsuario.exportarObjUsuario());
    }
</script>

<?php 

    function debug_to_console($data) {
        $output = $data;
        if (is_array($output))
            $output = implode(',', $output);

        echo '<script type="module">console.log("Debug Objects: ' . $output . '" );</script>';
    }

    if (isset($_POST['insert'])) {
        $nome = $_POST['txtNome'];
        $sobrenome = $_POST['txtSobrenome'];
        $dataNasc = $_POST['txtDataNasc'];
        $cpf = $_POST['txtCpf'];
        $rg = $_POST['txtRg'];
        $email = $_POST['txtEmail'];
        $senha = $_POST['txtSenha'];

        /*Endereço*/
        $logadouro = $_POST['txtLogadouro'];
        $numCasa = $_POST['txtNumCasa'];
        $complemento = $_POST['txtComplemento'];
        $bairro = $_POST['txtBairro'];
        $cep = $_POST['txtCep'];

        echo "<script>() => {
            var Usuario = require('../model/Usuario.js');
            var mongoDbClient =  require('./model/connection');
        
            var dbConnection = new mongoDbClient('site_appermuta');

            let nome_php = '<?php echo json_encode($nome); ?>';
            let sobrenome_php = '<?php echo json_encode($sobrenome); ?>'; 
            let dataNasc_php = '<?php echo json_encode($dataNasc); ?>'; 
            let cpf_php = '<?php echo json_encode($cpf); ?>'; 
            let rg_php = '<?php echo json_encode($rg); ?>';
            let email_php = '<?php echo json_encode($email); ?>'; 
            let senha_php = '<?php echo json_encode($senha); ?>';
    
            debug_to_console($nome);
            
            /*Endereço*/
            let logadouro_php = '<?php echo json_encode($logadouro); ?>'; 
            let numCasa_php = '<?php echo json_encode($numCasa); ?>';
            let complemento_php = '<?php echo json_encode($complemento); ?>'; 
            let bairro_php = '<?php echo json_encode($bairro); ?>'; 
            let cep_php = '<?php echo json_encode($cep); ?>';
            
            let endereco_php = {
                logadouro: logadouro_php,
                numCasa: numCasa_php,
                complemento: complemento_php,
                bairro: bairro_php,
                cep: cep_php
            }
            
            console.log('To dentro');
            const onFailure = () => (console.log('Deu merda'));
            const onSuccess = (db) => {
                let objUsuario = new Usuario(db,nome_php, sobrenome_php, dataNasc_php, cpf_php, rg_php, email_php, senha_php, endereco_php);

                var a = objUsuario.inserirUsuario(objUsuario.exportarObjUsuario());
                var c = objUsuario.listarTodosUsuarios();

                return a && c;
            };

            return dbConnection.connect(onSuccess, onFailure);
            
        }</script>";

        /* if ($objUsuario->inserir($nome,$cpf,$telefone,$atraso)) {
            $objUsuario->redirect("../cliente-view.php");
        } */
       
    }

    if (isset($_POST['editar'])) {
        $id = $_POST['editar'];
        $nome = $_POST['txtNome'];
        $cpf = $_POST['txtCpf'];
        $telefone = $_POST['txtTelefone'];
        $atraso = $_POST['txtStatus'];

        if ($objUsuario->editar($id,$nome,$cpf,$telefone,$atraso)) {
            $objUsuario->redirect("../cliente-view.php");
        }
    }

    if (isset($_POST['deletar'])) {
        $id = $_POST['deletar'];

        if ($objUsuario->deletar($id)) {
            $objUsuario->redirect("../cliente-view.php");
        }
    }
?>