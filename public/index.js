const precoUnitario = 100;

const form = document.getElementById("formCliente"); // Corrigido o ID do formulário

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const dados = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    cpf: document.getElementById("cpf").value,
    qtdCanetas: document.getElementById("qtd-canetas").value
  }

  try {
    const response = await fetch("/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        nome: dados.nome, 
        email: dados.email ,
        cpf: dados.cpf,
        qtdCanetas: dados.qtdCanetas
      })
    });

    if (response.ok) {
      Swal.fire("Dados enviados com sucesso!");
      form.reset();
      document.getElementById("total").textContent = "0.00"; // Reseta o total após o envio
    } else {
      Swal.fire("Erro ao enviar dados!");
    }
  } catch (error) {
    console.error("Erro:", error);
    Swal.fire("Erro ao enviar dados!");
  }
});

// Atualiza o preço total dinamicamente
document.getElementById("qtd-canetas").addEventListener("input", function() {
  const quantidade = parseInt(this.value) || 0; // Garante que seja um número ou 0
  const precoTotal = quantidade * precoUnitario; // Calcula o preço total
  document.getElementById("total").textContent = precoTotal.toFixed(2); // Atualiza o valor no campo "Preço Total"
});