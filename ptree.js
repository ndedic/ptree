/**
 * Pythagoras tree fractal - http://en.wikipedia.org/wiki/Pythagoras_tree_(fractal)
 * ND, January 2013
 */

var PTree = (function(){

	
	var Calc = {};

	Calc.deg2rad = function (x) {
		return (Math.PI * x) / 180 ;
	};
	
	Calc.rad2deg = function (x) {
		return (180 * x) / Math.PI;
	};
	
	var Vertex = function(argX, argY, r, argPhi) {			
		
		var that = this,
			x = r * Math.cos(argPhi),
			y = r * Math.sin(argPhi);
			
		that.x = Math.round(x + argX);
		that.y = Math.round(y + argY);
	
		return that;		
	};
	
	var BaseLine = function (A, B) {	
		
		var that = this;
	
		that.xAxis = ( B.x - A.x );
		that.yAxis = ( B.y - A.y);			
		that.r = Math.sqrt( Math.pow(that.xAxis, 2) + Math.pow(that.yAxis, 2) );
		that.phi = Math.atan2( that.yAxis, that.xAxis );			
		
		return that;
	};
	
	var Branch = function (A, B) {
		
		var baseLine = new BaseLine(A, B),
			that = this;
		
		that.A = A;
		that.B = B;					
		that.C = new Vertex(A.x, A.y, baseLine.r, baseLine.phi + Branch._90degInRads);
		that.D = new Vertex(B.x, B.y, baseLine.r, baseLine.phi + Branch._90degInRads);			
		that.E = new Vertex(that.C.x, that.C.y, baseLine.r * Math.cos(Branch.triangleDegInRads), baseLine.phi + Branch.triangleDegInRads);	

		return that;
	};	
			
	Branch.triangleDegInRads = Calc.deg2rad(45);
	Branch._90degInRads = Calc.deg2rad(90);		
	
	var PTree = function (order, angle) {
	
		var that = this;

		that.X_MARGIN = 400;
		that.Y_MARGIN = 650;
		that.order = order || 10;			
		that.angle = angle || null;
		that.startX = 0;
		that.startY = 0;
		that.startR = 150;
		that.startPhi = 0;	
		that.init();
		
		return that;
	};

	PTree.prototype.init = function () {
	
		var that = this,
			A = new Vertex(that.startX, that.startY, that.startR, that.startPhi),		
			B = new Vertex(A.x, A.y, that.startR, that.startPhi),
			branch = null;
			
		if (that.angle !== null) {
			Branch.triangleDegInRads = Calc.deg2rad(that.angle);
		}
		
		branch = new Branch(A, B);
		
		that.canvas = document.getElementById('myCanvas');
		that.context = that.canvas.getContext('2d');
		that.drawTree(branch);
	
	};

	PTree.prototype.drawBranch = function(branch, order) {
		
		var that = this;
		
		that.context.beginPath();
		that.context.moveTo(branch.C.x + that.X_MARGIN, -branch.C.y + that.Y_MARGIN);
		that.context.lineTo(branch.C.x + that.X_MARGIN, -branch.C.y + that.Y_MARGIN);
		that.context.lineTo(branch.E.x + that.X_MARGIN, -branch.E.y + that.Y_MARGIN);
		that.context.lineTo(branch.D.x + that.X_MARGIN, -branch.D.y + that.Y_MARGIN);
		that.context.lineTo(branch.C.x + that.X_MARGIN, -branch.C.y + that.Y_MARGIN);
		that.context.lineTo(branch.A.x + that.X_MARGIN, -branch.A.y + that.Y_MARGIN);
		that.context.lineTo(branch.B.x + that.X_MARGIN, -branch.B.y + that.Y_MARGIN);
		that.context.lineTo(branch.D.x + that.X_MARGIN, -branch.D.y + that.Y_MARGIN);
		
		if (order < 2) {
			that.context.fillStyle = 'brown';
		} else {
			that.context.fillStyle = 'green';			
		}
		
		that.context.fill();
		that.context.stroke();					
	};
	
	PTree.prototype.drawTree = function(branch) {
	
		var that = this,
			branches = [],
			branch = branch,
			baseBranch = [],
			branchLeafs = [],
			leftB, rightB = null;
		
		for (var branchOrder = 0; branchOrder < that.order; branchOrder++) {
			
			if (branchOrder === 0) {
				
				that.drawBranch(branch, branchOrder);
				
				baseBranch.push(branch)				
				branches.push(baseBranch);
				
			} else {
				branchLeafs = [];			
				for (var leaf in branches[branchOrder - 1]) {	
					
					branch = branches[branchOrder - 1][leaf];
					leftB = new Branch(branch.C, branch.E);
					rightB = new Branch(branch.E, branch.D);
					
					that.drawBranch(leftB, branchOrder);
					that.drawBranch(rightB, branchOrder);
					
					branchLeafs.push(leftB);					
					branchLeafs.push(rightB);
				}			
				branches.push(branchLeafs);			
			}
		}
	}
	
	return PTree;

})();
