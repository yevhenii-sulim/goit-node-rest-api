const ctrlWrappers = (router) => {
	const func = async (req, res, next) => {
		try {
			await router(req, res, next);
		} catch (error) {
			next(error);
		}
	};
	return func;
};
export default ctrlWrappers;
