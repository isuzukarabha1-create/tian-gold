import { getStore } from '@netlify/blobs';

const STORE = 'tian-gold';
const KEY = 'app-data';
const DEFAULT = {
  adminPin: '888999',
  hargaDasar: 2335000,
  margin: 0,
  history: [],
  kadarList: [
    {n:'300 (6K)', p:0.27},
    {n:'375 (8K)', p:0.34},
    {n:'420 (9–10K)', p:0.37},
    {n:'700 (16K)', p:0.67},
    {n:'750 (17–18K)', p:0.71},
    {n:'21K', p:0.84},
    {n:'22K', p:0.89},
    {n:'23–24K', p:0.91}
  ],
  lastRes: null,
  transaksi: []
};

function store(){ return getStore(STORE); }
async function readData(){
  const d=await store().get(KEY,{type:'json'});
  return d || DEFAULT;
}

export default async (req) => {
  try {
    if(req.method==='GET') return Response.json({ok:true,data:await readData()});
    if(req.method==='PUT'){
      const body=await req.json();
      const current=await readData();
      const data={...current,...body};
      await store().setJSON(KEY,data);
      return Response.json({ok:true,data});
    }
    return new Response('Method Not Allowed',{status:405});
  } catch(e){
    return Response.json({ok:false,error:String(e?.message||e)},{status:500});
  }
};

export const config = { path: '/api/data' };
