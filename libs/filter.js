const {filter_json}=require('./libs')

module.exports=(filter, cdata)=>{
  return filter_json(filter, cdata).cdata
}

