// logged on first run
import colors from 'colors';
console.log('JMguessr'.red.underline+'\nA game by '+'the JM Comp Sci Club\n'.italic+'\n');
const version = Number(process.version.substring(1).split('.')[0])
if(version < 20) {
  console.log('NodeJS version under v20 detected.\nIt is recommended to upgrade to avoid facing issues.\nWe do not test bugs for these versions.\n'.red);
}