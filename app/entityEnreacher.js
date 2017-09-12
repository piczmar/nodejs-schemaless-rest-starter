

function EntityEnreacher(){

	this.enreach = function(entity){
		if(entity._v){
			entity._updatedAt = new Date();
			entity._v = entity._v + 1;
		}else{
			entity._createdAt = new Date();
			entity._updatedAt = new Date();
			entity._v = 1;
		}
		if(entity.startTime){
			entity.startTime = new Date(entity.startTime);
		}
		if(entity.endTime){
			entity.endTime = new Date(entity.endTime);
		}
	}
}

module.exports.EntityEnreacher = EntityEnreacher;