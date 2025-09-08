function validateCpf(cpf) {
  if (!cpf) {
    return false;
  }

  // remove tudo que não for número
  cpf = cpf.replace(/\D/g, '');

  // verifica se tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // rejeita CPFs com todos os dígitos iguais (ex: 11111111111)
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  /**
   * Validação do 1º dígito verificador:
   * - Multiplica os 9 primeiros dígitos por pesos de 10 a 2
   * - Soma os resultados
   * - Calcula resto = 11 - (soma % 11)
   * - Se resto >= 10, o dígito esperado é 0
   * - Compara com o 10º dígito do CPF
   */
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let resto = 11 - (soma % 11);
  let digito1 = resto === 10 || resto === 11 ? 0 : resto;

  if (digito1 !== parseInt(cpf.charAt(9))) {
    return false;
  }

  /**
   * Validação do 2º dígito verificador:
   * - Multiplica os 10 primeiros dígitos por pesos de 11 a 2
   * - Soma os resultados
   * - Calcula resto = 11 - (soma % 11)
   * - Se resto >= 10, o dígito esperado é 0
   * - Compara com o 11º dígito do CPF
   */
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }

  resto = 11 - (soma % 11);
  let digito2 = resto === 10 || resto === 11 ? 0 : resto;

  if (digito2 !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

module.exports = validateCpf;
