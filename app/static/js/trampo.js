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



//https://stackoverflow.com/questions/4656843/get-querystring-from-url-using-jquery
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
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
  if (orderby_use.length==0){
    if(getUrlVars().hasOwnProperty('order_by')===true){
      orderby_use = getUrlVars()['order_by'];
    }
  }
  if (orderby_use==='new'){
    $('#recente').addClass('optionsmenuactive');
  }else{
    $('#relevancia').addClass('optionsmenuactive');
  }
  $.ajax({
       async: false,
       type: 'GET',
       url: `${API_END_POINT}/search-vacancies?key_source=${source_use}&keyword=${vaga_use}&zipcode=${cep_use}&page=${page_use}&order_by=${orderby_use}`,
       success: function(j_data) {
        if (j_data['status'] === 200){
          var total =  j_data['total'];
          $('#tx_qtdaprox').text(`Aproximadamente ${parseInt(total)} resultados`);

          var total_s = Math.round(total / 10);
          var pagina = j_data['page'];
          var path = '/resultado/';
          var params = `?key_source=${source_use}&keyword=${vaga_use}&zipcode=${cep_use}&order_by=${orderby_use}`;
          var total_pages = 0;
          var iniciar = 0;
          if(pagina>10){
            iniciar = pagina - 3;
          }
          for(var i=iniciar;i<total_s;i++){
            if(total_pages>10)
              break;
            var atual = ((i+1) === pagina ? 'optionsmenuactive' : '');
            $('ul#paginas').append(
              $('<li>').addClass(atual).append(
                $('<a>').attr('href', `${path}${params}&page=${i+1}`).text(
                  `${i+1}`
                )
              )
            );
            total_pages +=1;
          }
          j_data = j_data['data'];
          for(var i=0;i<j_data.length;i++){
            dados = j_data[i];
            elem = document.createElement('div');
            elem.classList.add('searchResultsItem');
            $(elem).append(
              $('<li>').append(
                $('<a>').attr('href', `#${dados['id']}`).attr('data_source', `${dados['source']}`).attr('data_id', `${dados['id']}`).attr('vacancy_source', true).text(
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
          if(vaga_use.length>0){
            relacionados = pegarRelacionados(source_use, vaga_use);
            j = relacionados.responseJSON;
            var total_related = 0;
            for(var i=0;i<j.length;i++){
              if(total_related>10)
                break
              var data = j[i];
              var params = `?&key_source=${source_use}&keyword=${data}&zipcode=${cep_use}&order_by=${orderby_use}`;
              $('ul#relatedSearchesList').append(
                $('<li>').append(
                  $('<a>').attr('href', `${path}${params}`).text(
                    `${data}`
                  )
                )
              );
              total_related += 1;
            }
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
  if (cep_use.length==0){
    if(getUrlVars().hasOwnProperty('zipcode')===true){
      cep_use = getUrlVars()['zipcode'];
    }
  }
  
  $(document).on('click', '#google_search', function(e){
    e.preventDefault();
    var find_str = $('#tx_find').val()
    window.location.href = `/resultado?key_source=${source_use}&keyword=${find_str}&zipcode=${cep_use}&order_by=${orderby_use}`;
  });
  if (cep_use.length>0){
    var dados_cep = pegarDadosCEP(cep_use);
    if(dados_cep){
      dados_cep = dados_cep.responseJSON;
      if(dados_cep.status === 200){
        $('#tx_cidade').text(dados_cep.data.city);
        $('#tx_estado').text(dados_cep.data.state);
      }
    }
  }
});


//https://stackoverflow.com/a/7257830
$(window).bind('hashchange', function () { 
  var hash = window.location.hash.slice(1);
  console.log(hash);
  if(['relevancia', 'recente'].includes(hash)){
    if(hash==='recente'){
      window.location.href = `/resultado?key_source=${source_use}&keyword=${vaga_use}&zipcode=${cep_use}&order_by=new`;
    }else{
      if(hash==='relevancia'){
        window.location.href = `/resultado?key_source=${source_use}&keyword=${vaga_use}&zipcode=${cep_use}&order_by=`;
      }
    }
  }
});