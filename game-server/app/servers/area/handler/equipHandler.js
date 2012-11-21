/**
 * Module dependencies
 */

var handler = module.exports;
var area = require('../../../domain/area/area');
var dataApi = require('../../../util/dataApi');

/**
 * Equip equipment, handle client' request
 *
 * @param {Object} msg, message
 * @param {Session} session
 * @api public
 */

handler.equip = function(msg, session, next) {
	var player = area.getPlayer(session.get('playerId'));
  var status = false;

  var item = player.bag.items[msg.index];
  var bagIndex = -1;
  if (item) {
    var eq =  dataApi.equipment.findById(item.id);
		if(!eq || player.level < eq.heroLevel){
			next(null, {status: false});
			return;
		}
		
    var curEqId = player.equipments.get(eq.kind);
    player.equip(eq.kind, eq.id);
    player.bag.removeItem(msg.index);
    if (curEqId > 0) {
      bagIndex = player.bag.addItem({id: curEqId, type: 'equipment'});
    }

    status = true;
  }
  next(null, {status: status, bagIndex: bagIndex});
};

/**
 * Unequip equipment, handle client' request
 *
 * @param {Object} msg
 * @param {Session} session
 * @api public
 */
handler.unEquip = function(msg, session, next) {
	var player = area.getPlayer(session.get('playerId'));
  var status = false;
  var bagIndex = -1;
  if (msg.putInBag) {
    bagIndex = player.bag.addItem({id: player.equipments.get(msg.type), type: 'equipment'});
    if (bagIndex > 0) {
      player.unEquip(msg.type);
      status = true;
    }
  } else {
    player.unEquip(msg.type);
    status = true;
  }
  
  next(null, {status: status, bagIndex: bagIndex});
};

