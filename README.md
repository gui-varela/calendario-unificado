# Calendario Unificado

> Projeto desenvolvido para a disciplina de Programação Avançada ministrada na Universidade Federal do Rio de Janeiro.

### Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [ ] Testes da aplicação
- [ ] Otimização de deploy

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:
* Você instalou a versão mais recente de Docker e Node.js
* Você tem uma máquina Linux-Ubuntu.
* Você leu o relatório com detalhes do projeto.

## 🚀 Instalando Calendario Unificado

Para instalar o Calendario Unificado, estando no diretório do projeto, siga estas etapas:

Linux:

#### Criando os containers:

```
  sudo docker build .
```
```
  sudo docker-compose up -d
```
#### Criando o banco de dados:

```
  npx prisma migrate dev --name mensagem-de-versionamento-do-banco
```
#### Atualizando o banco de dados:

```
  npx prisma generate
```
#### Removendo dados do banco de dados:

```
  npx prisma migrate reset
```
#### Visualizando o banco de dados:

```
  npx prisma studio
```
#### Inserindo dado no banco de dados:

```
  npx ts-node prisma/queries.ts
```

#### Rodando a aplicação:
```
  npm start
```

## ☕ Usando Calendario Unificado

...

## 🤝 Time

Agradecemos às seguintes pessoas que contribuíram para este projeto:

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/52808390?v=4" width="100px;" alt="Foto do Gui"/><br>
        <sub>
          <b>Guilherme Varela</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/64283812?v=4" width="100px;" alt="Foto da Karen"/><br>
        <sub>
          <b>Karen Pacheco</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://avatars.githubusercontent.com/u/73672642?v=4" width="100px;" alt="Foto do Leo"/><br>
        <sub>
          <b>Leonardo Costa</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="#">
        <img src="https://gitlab.com/uploads/-/system/user/avatar/8412485/avatar.png?width=400" width="100px;" alt="Foto da Lari"/><br>
        <sub>
          <b>Larissa Bral</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

[⬆ Voltar ao topo](#calendario-unificado)<br>
