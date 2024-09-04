var keystone = require('../../../');

module.exports = function(req, res) {
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError('invalid csrf');
	}
	if (req.list.get('nodelete')) {
		return res.apiError('nodelete');
	}
	if (req.user && req.params.id === req.user.id) {
		return res.apiError('not allowed', 'You can not delete yourself');
	}
	req.list.model.findById(req.params.id).exec().then(function (err, item) {
		if (err) {
			return res.apiError('database error', err);
		}
		if (!item) {
			return res.apiError(404);
		}
		item.deleteOne({_id: req.params.id}).then(function (err) {
			if (err) return res.apiError('database error', err);
			return res.json({
				success: true,
				id: req.params.id
			});
		});
	});
};
