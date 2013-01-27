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
		var phi = argPhi,
			x = r * Math.cos(phi),
			y = r * Math.sin(phi);
			
		this.x = Math.round(x + argX);
		this.y = Math.round(y + argY);
	
		return this;		
	}
	
	var BaseLine = function (A, B) {		
		this.xAxis = ( B.x - A.x );
		this.yAxis = ( B.y - A.y);			
		this.r = Math.sqrt( Math.pow(this.xAxis,2) + Math.pow(this.yAxis,2) );
		this.phi = Math.atan2(this.yAxis, this.xAxis);			
		
		return this;
	};
	
	var Branch = function (A, B) {
		
		var baseLine = new BaseLine(A, B);
		
		this.A = A;
		this.B = B;					
		this.C = new Vertex(A.x, A.y, baseLine.r, baseLine.phi + Branch._90degInRads);
		this.D = new Vertex(B.x, B.y, baseLine.r, baseLine.phi + Branch._90degInRads)			
		this.E = new Vertex(this.C.x, this.C.y, baseLine.r * Math.cos(Branch.triangleDegInRads), baseLine.phi + Branch.triangleDegInRads);	

		return this;
	};	
			
	Branch.triangleDegInRads = Calc.deg2rad(45);
	Branch._90degInRads = Calc.deg2rad(90);		

	
	var PTree = function (order, angle) {
	
		var that = this;

		that.X_MARGIN = 500;
		that.Y_MARGIN = 600;
		that.order = order || 10;			
		that.angle = angle || null;
		that.startX = 0;
		that.startY = 0;
		that.startR = 120;
		that.startPhi = 0;	
		this.init();
		
		return this;
	};

	PTree.prototype.init = function () {
	
		var that = this,
			A = new Vertex(that.startX, that.startY, that.startR, that.startPhi),		
			B = new Vertex(A.x, A.y, that.startR, that.startPhi),
			branch = null;
			
		if (that.angle != null) {
			Branch.triangleDegInRads = Calc.deg2rad(that.angle);
		}
		
		branch = new Branch(A, B, 0);
		
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
			branches = [];
		
		for (var i = 0; i < that.order; i++) {
			
			if (i == 0) {
				var base = [];
				base.push(branch)
				that.drawBranch(branch, i);
				branches.push(base);
			} else {
				var branchPair = [];
				for (var j in branches[i - 1]) {						
					var branch = (branches[i - 1][j]);
					var leftB = new Branch(branch.C, branch.E);
					var rightB = new Branch(branch.E, branch.D);
					branchPair.push(leftB);					
					branchPair.push(rightB);
					that.drawBranch(leftB, i);
					that.drawBranch(rightB, i);
				}
				branches.push(branchPair);			
			}
		}
	}

	return PTree;

})();
