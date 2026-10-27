export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    const visibleItems = this.filterItems(user, items);
    const total = visibleItems.reduce((sum, item) => sum + item.value, 0);

    return [
      this.generateHeader(reportType, user),
      this.generateBody(reportType, user, visibleItems),
      this.generateFooter(reportType, total),
    ].join('');
  }

  filterItems(user, items) {
    if (user.role === 'ADMIN') {
      return items;
    }

    if (user.role === 'USER') {
      return items.filter(item => item.value <= 500);
    }

    return [];
  }

  generateHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    }

    if (reportType === 'HTML') {
      return [
        '<html><body>\n',
        '<h1>Relatório</h1>\n',
        `<h2>Usuário: ${user.name}</h2>\n`,
        '<table>\n',
        '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n',
      ].join('');
    }

    return '';
  }

  generateBody(reportType, user, items) {
    return items.map(item => this.generateRow(reportType, user, item)).join('');
  }

  generateRow(reportType, user, item) {
    if (reportType === 'CSV') {
      return `${item.id},${item.name},${item.value},${user.name}\n`;
    }

    if (reportType === 'HTML') {
      const style =
        user.role === 'ADMIN' && item.value > 1000
          ? ' style="font-weight:bold;"'
          : '';

      return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
    }

    return '';
  }

  generateFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,\n`;
    }

    if (reportType === 'HTML') {
      return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    }

    return '';
  }
}
