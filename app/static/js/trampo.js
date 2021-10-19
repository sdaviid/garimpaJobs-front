function pegarDadosVaga(source, id_vaga){
  return $.ajax({
       async: false,
       type: 'GET',
       url: API_END_POINT + 'get-vacancy/' + source + '/' + id_vaga,
       success: function(j_data) {
            console.log(j_data);
            return j_data;
            }
       });
}

function pegarRelacionados(source, chave){
  return $.ajax({
       async: false,
       type: 'GET',
       url: API_END_POINT + 'get-keywords-from/' + source + '/' + chave,
       success: function(j_data) {
            console.log(j_data);
            return j_data;
            }
       });
}
function openNav(source, id_vaga) {
  dados_vaga = pegarDadosVaga(source, id_vaga);
  console.log('dados vaga');
  console.log(dados_vaga);
  j = dados_vaga.responseJSON;
  if (j.status === 200){
    /*document.getElementById('tx_empresa').innerHTML = j.data.name;*/
    document.getElementById('tx_title').innerHTML = j.data.vacancy;
    document.getElementById('tx_salary').innerHTML = j.data.salary;
    document.getElementById('tx_period').innerHTML = j.data.period;
    document.getElementById('tx_contract').innerHTML = j.data.contract;
    var detalhes = '';
    var company_name = j.data.name;
    var company_city = j.data.city;
    var company_state = j.data.state;
    var date_creation = j.data.date_creation;
    var detalhes = `${company_name} - ${company_city}, ${company_state} - ${date_creation}`;
    document.getElementById('tx_details').innerHTML = detalhes;
    /*document.getElementById('tx_date_creation').innerHTML = j.data.date_creation;*/
    document.getElementById('ul_requeriments').innerHTML = '';
    if (j.data.requirements.length > 0){
      for(var i=0;i<j.data.requirements.length;i++){
        var vv = j.data.requirements[i];
        document.getElementById('ul_requeriments').innerHTML += '<li>' + vv + '</li>';
      }
    }
    document.getElementById('ul_description').innerHTML = '';
    if (j.data.description.length > 0){
      for(var i=0;i<j.data.description.length;i++){
        var vv = j.data.description[i];
        document.getElementById('ul_description').innerHTML += '<li>' + vv + '</li>';
      }
    }
    document.getElementById('ul_benefits').innerHTML = '';
    if (j.data.benefits.length > 0){
      for(var i=0;i<j.data.benefits.length;i++){
        var vv = j.data.benefits[i];
        document.getElementById('ul_benefits').innerHTML += '<li>' + vv + '</li>';
      }
    }
    document.getElementById('tx_url').href = j.data.url;
  }
  $('#modal-social').modal()
  
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginRight = "0";
}



$(document).ready(function(){
  $.ajax({
       async: false,
       type: 'GET',
       url: API_END_POINT + 'search-vacancies/' + source_use + '/' + vaga_use + '/' + cep_use + '?page=' + page_use,
       success: function(j_data) {
        if (j_data['status'] === 200){
          var total =  j_data['total'];
          document.getElementById('tx_qtdaprox').innerHTML = 'Aproximadamente ' + parseInt(total) + ' resultados';
          var total_s = Math.round(total / 10);
          var pagina = j_data['page'];
          var path = '/resultado/';
          var params = source_use + '/' + vaga_use + '/' + cep_use;
          for(var i=0;i<total_s;i++){
            elem = document.createElement('li')
            if((i+1) === pagina){
              elem.id = 'optionsmenuactive';
            }

            elht = '<a href="' + path + params + '?page=' + (i+1).toString() + '">' + (i+1).toString() + '</a>';
            elem.innerHTML = elht;
            document.getElementById('paginas').appendChild(elem);
          }
          j_data = j_data['data'];
              for(var i=0;i<j_data.length;i++){
                dados = j_data[i];
                elem = document.createElement('div');
                elem.classList.add('searchResultsItem');//href="#" 
                /*elht = '<li><a href="#' + dados['id'] + '" data-toggle="modal" data-target="#modal-social">' + dados['vacancy'] + '</a></li><p class="resultAddr">' + dados['name'] + ' - ' + dados['city'] + '/' + dados['state'] + '</p><p><span>' + dados['date_creation'] + '</span>' + dados['description'] + '</p>';*/
                elht = '<li><a href="#' + dados['id'] + '" onclick="openNav(\'' + source_use + '\', ' + dados['id'] + ');">' + dados['vacancy'] + '</a></li><p class="resultAddr">' + dados['name'] + ' - ' + dados['city'] + '/' + dados['state'] + '</p><p><span>' + dados['date_creation'] + '</span>' + dados['description'] + '</p>';
                elem.innerHTML = elht;
                document.getElementById('jobs').appendChild(elem);
              }
            relacionados = pegarRelacionados(source_use, vaga_use);
            j = relacionados.responseJSON;
            for(var i=0;i<j.length;i++){
              var data = j[i];
              elem = document.createElement('li');
              var params = source_use + '/' + data + '/' + cep_use;
              elht = '<a href="' + path + params + '">' + data + '</a>'
              elem.innerHTML = elht;
              document.getElementById('relatedSearchesList').appendChild(elem);
            }
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
        var msg = '';
        if (XMLHttpRequest.status === 0){
          msg = 'Fail to connect API';
        }
        else{
          if(XMLHttpRequest.responseJSON.hasOwnProperty('message')){
            msg = XMLHttpRequest.responseJSON.message;
          }
        }
        console.log(XMLHttpRequest);
        console.log(textStatus);
        console.log(errorThrown);
        document.getElementById('relatedSearches').style.display = 'none';
        document.getElementById('diverror').style.display = 'block';
        document.getElementById('msgerror').innerHTML = msg;
      }
  });
});
$(document).on('click', '#google_search', function(e){
  e.preventDefault();
  window.location.href = '/resultado/' + source_use + '/' + document.getElementById('tx_find').value + '/' + cep_use;
})