'use strict';

function billFormat(value) {
  value = Math.ceil(value * 100) / 100;
  value = value.toFixed(2);
  return '$' + value;
}

function yourBill() {
  var bill = Number(document.getElementById('yourBill').value);
  if (isNaN(bill) || bill <= 0) {
    alert("Numbers Only Please!");
    document.getElementById('yourBill').value = '';
    return;
  }
  var tipPercent = document.getElementById('tipInput').value;
  var tipValue = (bill * tipPercent) / 100;
  var totalWithTip = bill + tipValue;

  document.getElementById('tipPercent').textContent = tipPercent + '%';
  document.getElementById('tipValue').textContent = billFormat(tipValue);
  document.getElementById('totalWithTip').textContent = billFormat(totalWithTip);
}

var oninput = document.getElementById('tipCalculator');
oninput.addEventListener('input', yourBill);
