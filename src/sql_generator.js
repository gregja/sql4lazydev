var sqlGenerator = (function () {
  "use strict";

  var container, field_source, field_formats, field_valgen, field_prefix, btn_submit,
      result, btn_example;

  var data_examples = {};
  data_examples.ex1 = `IP_ADRESS,
DAT_DEB_SESSION,
MATRICULE,
DAT_FIN_SESSION,
PLATFORM,
BROWSNER_VENDOR,
SCREEN_WIDTH,
SCREEN_HEIGHT`;

  data_examples.ex2 = `IP_ADRESS="111.222.333.444",
DAT_DEB_SESSION="2018-11-15",
MATRICULE="XXXXX",
DAT_FIN_SESSION,
PLATFORM="WIN",
BROWSNER_VENDOR="Moz",
SCREEN_WIDTH=1024,
SCREEN_HEIGHT=800`;

  data_examples.ex3 = `{IP_ADRESS:"111.222.333.444",
DAT_DEB_SESSION:"2018-11-15",
MATRICULE:"XXXXX",
DAT_FIN_SESSION:"NULL",
PLATFORM:"WIN",
BROWSNER_VENDOR:"Moz",
SCREEN_WIDTH:1024,
SCREEN_HEIGHT:800}`;


  function gensql(e) {
    e.preventDefault();

    var columns = [];
    var values = [];

    if (field_formats.value == '3') {
      // data in JSON format
      let tmp_inst = `tmp_val = ${field_source.value.trim()}`;
      let tmp_val = null;
      try {
        eval(tmp_inst);
        columns = Object.keys(tmp_val);
        values = Object.values(tmp_val);
      } catch (e) {
        console.log(e);
      }
    }

    if (field_formats.value != '3') {
      if (field_source.value.trim() != '') {
        let tmp_columns = field_source.value.split(',');
        if (tmp_columns && tmp_columns.length && tmp_columns.length > 0) {
          let tmp_cols = tmp_columns.map(e => e.replace('\n', ''));
          tmp_cols.forEach(e => {
            let x1 = '';
            let x2 = '';
            if (e.indexOf('=') != -1) {
              let xx = e.split('=');
              x1 = xx[0];
              x2 = xx[1];
            } else {
              x1 = e;
              x2 = "NULL";
            }
            if (field_formats.value == "1") {
              x2 = "NULL";
            }
            columns.push(x1);
            values.push(x2);
          });
        }
      }
    }

    var tmp_prefix = '';
    if (field_prefix.value != '') {
      tmp_prefix = field_prefix.value.trim() + '.';
    }

    var insert_tab = [];
    var update_tab = [];
    columns.forEach((e, x) => {
      let value = '';
      if (field_valgen.value == '4') {
        insert_tab.push(`${e}=${tmp_prefix}${e}`);
        update_tab.push(`${tmp_prefix}${e}`);
      } else {
        if (field_valgen.value == "2" || field_valgen.value == "3") {
          if (values[x] != 'NULL') {
            insert_tab.push(`${e}=${values[x]}`);
            update_tab.push(`${values[x]}`);
          } else {
            if (field_valgen.value == "2") {
              insert_tab.push(`${e}=NULL`);
              update_tab.push('NULL');
            } else {
              insert_tab.push(`${e}=?`);
              update_tab.push('?');
            }
          }
        } else {
          insert_tab.push(`${e}=?`);
          update_tab.push('?');
        }
      }
    });

    var table_name = 'XXXXX';

    var update_sql = "UPDATE " + table_name + " SET " + insert_tab.join(', ');

    var insert_sql = 'INSERT INTO ' + table_name + ' (' + columns.join(', ') + ')';
    insert_sql += '<br>VALUES (' + update_tab.join(', ') + ')';

    result.innerHTML = update_sql + "<br><br><hr><br>" + insert_sql;
  }

  function _init() {
    container = document.querySelector('[data-id=container]');

    field_source = container.querySelector('[data-id=source]');

    field_formats = container.querySelector('[data-id=formats]');
    field_valgen = container.querySelector('[data-id=valgen]');
    field_prefix = container.querySelector('[data-id=prefix]');

    btn_submit = container.querySelector('[data-id=submit]');
    btn_submit.addEventListener('click', gensql, false);

    result = container.querySelector('[data-id=resultat]');

    btn_example = container.querySelector('[data-id=btn_example]');
    btn_example.addEventListener('click', function(e) {
      e.preventDefault();
      field_source.value = data_examples['ex'+field_formats.value];
    }, false);

  }

  // Déclaration des méthodes et propriétés publiques
  return {
    init: _init
  };
})();

document.addEventListener("DOMContentLoaded", function (event) {
  sqlGenerator.init();
});



