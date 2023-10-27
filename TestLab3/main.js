'use strict';

function billFormat(value) {
  value = Math.ceil(value * 100) / 100;
  value = value.toFixed(2);
  return '$' + value;
}

function splitFormat(value) {
  if (value == 1 ) return value + ' Person';
  return value + ' People';
}

function yourBill() {
  var bill = Number(document.getElementById ('yourBill').value);
  if(isNaN(bill) || bill <= 0)
  {
      alert("Numbers Only Please!");
      document.getElementById('yourBill').value = '';
      yourBill = "";
  }
  var tipPercent = document.getElementById ('tipInput').value;
  var split = document.getElementById ('splitInput').value;
  var tipValue = bill * (tipPercent / 100) ;   // console.log(tipValue);
  var tipEach = tipValue / split;
  var splitBillEach = ( bill + tipValue ) / split;
  console.log(splitBillEach);

  document.getElementById('tipPercent').innerHTML = tipPercent + '%';
  document.getElementById('tipValue').innerHTML = billFormat(tipValue);
  document.getElementById('totalWithTip').innerHTML = billFormat(bill + tipValue);
  document.getElementById('splitValue').innerHTML = splitFormat(split);
  document.getElementById('billEach').innerHTML = billFormat(splitBillEach);
  document.getElementById('tipEach').innerHTML = billFormat(tipEach);

}
  var oninput = document.getElementById('oninput');
  oninput.addEventListener('input', yourBill)
