let Tarefas = [];

// Função para obter a data atual no formato 'dd/mm/yyyy'
function TaskData() {
    let dataAtual = new Date();
    let dia = String(dataAtual.getDate()).padStart(2, '0');
    let mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    let ano = dataAtual.getFullYear();
    let dataFormatada = dia + '/' + mes + '/' + ano;
    return dataFormatada;
}

// Função para adicionar uma nova tarefa
function adicionarTask(event) {
    event.preventDefault();

    const nome = document.getElementById('task-name').value;
    const etiqueta = document.getElementById('task-etiqueta').value;

    const novaTarefa = { tarefa: nome, etiqueta: etiqueta, criada: TaskData() };
    Tarefas.push(novaTarefa);
    saveTarefas(); // Salva as tarefas no localStorage

    document.getElementById('createListaForm').reset();
    renderTarefas();
    atualizarStatusTarefas(); // Atualiza o status após adicionar a nova tarefa
}

// Função para renderizar as tarefas na lista
function renderTarefas() {
    const lista = document.getElementById('todo-list');
    lista.innerHTML = '';

    Tarefas.forEach((tarefa, index) => {
        const listItem = document.createElement('li');

        const tarefaNome = document.createElement('div');
        tarefaNome.textContent = tarefa.tarefa;
        tarefaNome.className = 'task-name';

        const tarefaEtiqueta = document.createElement('div');
        tarefaEtiqueta.textContent = tarefa.etiqueta;
        tarefaEtiqueta.className = 'task-etiqueta';

        const tarefaData = document.createElement('div');
        tarefaData.textContent = `Criada em: ${tarefa.criada}`;
        tarefaData.className = 'task-data';

        const DoneTaskButton = document.createElement('button');
        DoneTaskButton.textContent = 'Concluir';
        DoneTaskButton.className = 'btn_concluir';
        DoneTaskButton.ariaLabel = 'Remover tarefa';

        DoneTaskButton.addEventListener('click', () => {
            if (DoneTaskButton.classList.contains('concluido')) {
                DoneTaskButton.textContent = 'Concluir';
                DoneTaskButton.classList.remove('concluido');
                DoneTaskButton.classList.add('btn_concluir');
            } else {
                DoneTaskButton.innerHTML = '<img src="css/img/concluido.png" style="width: 35px;" alt="Concluído">';
                DoneTaskButton.classList.remove('btn_concluir');
                DoneTaskButton.classList.add('concluido');
            }
            atualizarStatusTarefas();
            saveTarefas(); // Salva as tarefas no localStorage após atualização
        });

        listItem.appendChild(tarefaNome);
        listItem.appendChild(tarefaEtiqueta);
        listItem.appendChild(tarefaData);
        listItem.appendChild(DoneTaskButton);

        lista.appendChild(listItem);
    });
}

// Função para salvar as tarefas no localStorage
function saveTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(Tarefas));
}

// Função para carregar as tarefas do localStorage
function loadTarefas() {
    const tarefasSalvas = localStorage.getItem('tarefas');
    if (tarefasSalvas) {
        Tarefas = JSON.parse(tarefasSalvas);
    }
}

// Função para deletar tarefas concluídas
function deletarConcluidas() {
    Tarefas = Tarefas.filter((_, index) => {
        const taskButton = document.getElementsByClassName('btn_concluir')[index] || document.getElementsByClassName('concluido')[index];
        return !taskButton || !taskButton.classList.contains('concluido'); // Mantém apenas as tarefas não concluídas
    });
    saveTarefas(); // Salva as tarefas no localStorage após exclusão
    renderTarefas();
    atualizarStatusTarefas();
}

// Função para atualizar o status das tarefas
function atualizarStatusTarefas() {
    const totalTasks = Tarefas.length;
    const completedTasks = document.querySelectorAll('.concluido').length;
    document.getElementById('task-status').textContent = `Total: ${totalTasks} | Concluídas: ${completedTasks}`;
}

// Chama a função para carregar as tarefas e adicionar eventos quando a página carregar
window.onload = function () {
    loadTarefas(); // Carrega as tarefas do localStorage
    renderTarefas();
    atualizarStatusTarefas();

    document.getElementById('createListaForm').addEventListener('submit', (event) => {
        adicionarTask(event);
        atualizarStatusTarefas();
    });

    // Adiciona o evento ao botão de deletar tarefas concluídas
    document.getElementById('delete-completed-button').addEventListener('click', deletarConcluidas);
};
