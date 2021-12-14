<?php 
    require_once '../model/filme.php';
    $objFilme = new Filme();

    if (isset($_POST['insert'])) {
        $nome = $_POST['txtNome'];
        $descricao = $_POST['txtDescricao'];
        $valor = $_POST['txtValor'];
        $quantidade = $_POST['txtQuantidade'];

        if ($objFilme->inserir($nome,$descricao,$valor,$quantidade)) {
            $objFilme->redirect("../filme-view.php");
        }
    }

    if (isset($_POST['editar'])) {
        $id = $_POST['editar'];
        $nome = $_POST['txtNome'];
        $descricao = $_POST['txtDescricao'];
        $valor = $_POST['txtValor'];
        $quantidade = $_POST['txtQuantidade'];

        if ($objFilme->editar($id,$nome,$descricao,$valor,$quantidade)) {
            $objFilme->redirect("../filme-view.php");
        }
    }

    if (isset($_POST['deletar'])) {
        $id = $_POST['deletar'];

        if ($objFilme->deletar($id)) {
            $objFilme->redirect("../filme-view.php");
        }
    }
?>