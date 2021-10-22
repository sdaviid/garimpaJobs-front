function pegarDadosVaga(source, id_vaga){
  return $.ajax({
       async: false,
       type: 'GET',
       url: `${API_END_POINT}/get-vacancy/${source}/${id_vaga}`,
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
       url: `${API_END_POINT}/get-keywords-from/${source}/${chave}`,
       success: function(j_data) {
            console.log(j_data);
            return j_data;
            }
       });
}



function pegarDadosCEP(cep){
  return $.ajax({
       async: false,
       type: 'GET',
       url: `${API_END_POINT}/get-zipcode/${cep}`,
       success: function(j_data) {
            console.log(j_data);
            return j_data;
            }
       });
}



function openNav(source, id_vaga) {
  dados_vaga = pegarDadosVaga(source, id_vaga);
  j = dados_vaga.responseJSON;
  if (j.status === 200){
    $('#tx_title').text(j.data.vacancy);
    $('#tx_salary').text(j.data.salary);
    $('#tx_period').text(j.data.period);
    $('#tx_contract').text(j.data.contract);
    var detalhes = `${j.data.name} - ${j.data.city}, ${j.data.state} - ${j.data.date_creation}`;
    $('#tx_details').text(detalhes);
    $('#ul_requeriments').empty();
    if (j.data.requirements.length > 0){
      for(var i=0;i<j.data.requirements.length;i++){
        $('#ul_requeriments').append(
          $(`<li>${j.data.requirements[i]}</li>`)
        );
      }
    }
    $('#ul_description').empty();
    if (j.data.description.length > 0){
      for(var i=0;i<j.data.description.length;i++){
        $('#ul_description').append(
          $(`<li>${j.data.description[i]}</li>`)
        );
      }
    }
    $('#ul_benefits').empty();
    if (j.data.benefits.length > 0){
      for(var i=0;i<j.data.benefits.length;i++){
        $('#ul_benefits').append(
          $(`<li>${j.data.benefits[i]}</li>`)
        );
      }
    }
    document.getElementById('tx_url').href = j.data.url;
  }
  $('#modal-social').modal()
  
}




$(document).ready(function(){
  $.ajax({
       async: false,
       type: 'GET',
       url: `${API_END_POINT}/search-vacancies/${source_use}/${vaga_use}/${cep_use}?page=${page_use}`,
       success: function(j_data) {
        if (j_data['status'] === 200){
          var total =  j_data['total'];
          $('#tx_qtdaprox').text(`Aproximadamente ${parseInt(total)} resultados`);

          var total_s = Math.round(total / 10);
          var pagina = j_data['page'];
          var path = '/resultado/';
          var params = `${source_use}/${vaga_use}/${cep_use}`;
          for(var i=0;i<total_s;i++){
            var atual = ((i+1) === pagina ? 'optionsmenuactive' : '');
            $('ul#paginas').append(
              $('<li>').attr('id', atual).append(
                $('<a>').attr('href', `${path}${params}?page=${i+1}`).text(
                  `${i+1}`
                )
              )
            );
          }
          j_data = j_data['data'];
          for(var i=0;i<j_data.length;i++){
            dados = j_data[i];
            elem = document.createElement('div');
            elem.classList.add('searchResultsItem');
            $(elem).append(
              $('<li>').append(
                $('<a>').attr('href', `#${dados['id']}`).attr('data_source', `${source_use}`).attr('data_id', `${dados['id']}`).attr('vacancy_source', true).text(
                  `${dados['vacancy']}`
                )
              )
            );
            $(elem).append(
              $('<p>').addClass('resultAddr').text(
                `${dados['name']} - ${dados['city']}/${dados['state']}`
              )
            );
            $(elem).append(
              $('<p>').append(
                $('<span>').text(
                  `${dados['date_creation']}`
                )
              ).append(
                `${dados['description']}`
              )
            );
            $('#jobs').append(elem);
          }
          relacionados = pegarRelacionados(source_use, vaga_use);
          j = relacionados.responseJSON;
          for(var i=0;i<j.length;i++){
            var data = j[i];
            var params = `${source_use}/${data}/${cep_use}`;
            $('ul#relatedSearchesList').append(
              $('<li>').append(
                $('<a>').attr('href', `${path}${params}`).text(
                  `${data}`
                )
              )
            );
          }
        }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
        var msg = '[ERROR API COMMUNICATION]';
        if (XMLHttpRequest.status === 0){
          msg += ' - API SERVER MAYBE DOWN';
        }
        else{
          if(XMLHttpRequest.responseJSON.hasOwnProperty('message')){
            msg += ` - ${XMLHttpRequest.responseJSON.message}`;
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
  
  $('a[vacancy_source="true"]').click(function(event) {
    var obj = $(this);
    openNav(obj.attr('data_source'), obj.attr('data_id'));
  });
  
  $(document).on('click', '#google_search', function(e){
    e.preventDefault();
    var find_str = $('#tx_find').val()
    window.location.href = `/resultado/${source_use}/${find_str}/${cep_use}`;
  });

  var dados_cep = pegarDadosCEP(cep_use);
  if(dados_cep){
    dados_cep = dados_cep.responseJSON;
    if(dados_cep.status === 200){
      $('#tx_cidade').text(dados_cep.data.city);
      $('#tx_estado').text(dados_cep.data.state);
    }
  }
});