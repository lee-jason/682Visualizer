(function(){
    var app = new angular.module('bonus', []);


    
    app.controller('FormController', function($scope, KillstreakMessages){
        var that = this;

        this.ksMessages = KillstreakMessages;
        
        this.toggleData = {
            t681: true,
            t682: true,
            t682b: true
        }
        
        this.victimKillStreak = 4;
        this.victimTeamNW = 45000;
        this.victimTeamXP = 82000;
        this.victimNW = 13425;
        this.killerTeamNW = 34000;
        this.killerTeamXP = 72000;
        this.assistingHeroes = 4;
        
        
        this.updateValuesFromCode = function(){
            console.log('update values hit');
            var config = $.parseJSON(that.shareableCode);
            that.victimKillStreak = config.victimKillStreak;
            that.victimTeamNW = config.victimTeamNW;
            that.victimTeamXP = config.victimTeamXP;
            that.victimNW = config.victimNW;
            that.killerTeamNW = config.killerTeamNW;
            that.killerTeamXP = config.killerTeamXP;
            that.assistingHeroes = config.assistingHeroes;
        }
        
        var generateShareCodeString = function(){
            return JSON.stringify({
                victimKillStreak: that.victimKillStreak,
                victimTeamNW: that.victimTeamNW,
                victimTeamXP: that.victimTeamXP,
                victimNW: that.victimNW,
                killerTeamNW: that.killerTeamNW,
                killerTeamXP: that.killerTeamXP,
                assistingHeroes: that.assistingHeroes})
        }
        
        this.shareableCode = generateShareCodeString();
        
        this.update = function(name){
            updateView(name);
            updateCalculation();
            
        }
        
        var updateCalculation = function(name){
            //can't have victimnw be greater than team nw that makes no sense.
            if(that.victimNW > that.victimTeamNW){
                that.victimTeamNW = that.victimNW;
            }
        }
        
        var updateView = function(name){
            if(name==="killerTeamXP"){
                that.killerTeamXP = parseInt(that.killerTeamXP);
            }
            if(name==="victimTeamXP"){
                that.victimTeamXP = parseInt(that.victimTeamXP);
            }
            if(name==="victimNW"){
                that.victimNW = parseInt(that.victimNW);
            }
            if(name==="victimKillStreak"){
                that.victimKillStreak = parseInt(that.victimKillStreak);   
            }
            if(name==="victimTeamNW"){
                that.victimTeamNW = parseInt(that.victimTeamNW);
            }
            if(name==="killerTeamNW"){
                that.killerTeamNW = parseInt(that.killerTeamNW);
            }
            if(name==="assistingHeroes"){
                that.assistingHeroes = parseInt(that.assistingHeroes);
            }
            that.shareableCode = generateShareCodeString();
        }
    });
    
    app.directive('chart', function(ClashManager, $timeout, ExperiencePerLevel){
        return{
            restrict: 'A',
            link: function(scope, elem, attr){
                
                    var data681 = [];
                    var data682 = [];
                    var data682b = [];
                    var emptydefaults = [];
                    for(var i = 0; i < 25; i++){
                        emptydefaults.push(0);   
                    }
                    var labels = [];
                    for(var i = 0; i < 25; i++){
                        labels.push(i+1);
                    }
                                    
                var temp681Dataset = [];
                var temp682Dataset = [];
                var temp682bDataset = [];
                
                var reupdateChartData = function(){
                    
                    var v681Exists = false;
                    var v682Exists = false;
                    var v682bExists = false;
                    
                    for(var i = 0; i < goldChart.datasets.length; i++){
                        if(goldChart.datasets[i].label === "v681"){
                            v681Exists = true;
                        }
                        if(goldChart.datasets[i].label === "v682"){
                            v682Exists = true;
                        }
                        if(goldChart.datasets[i].label === "v682b"){
                            v682bExists = true;
                        }
                    }
                    
                    if(scope.formCtrl.toggleData.t681 && !v681Exists){
                        goldChart.datasets.push(temp681Dataset);
                    }
                    if(scope.formCtrl.toggleData.t682 && !v682Exists){
                        goldChart.datasets.push(temp682Dataset);
                    }
                    if(scope.formCtrl.toggleData.t682b && !v682bExists){
                        goldChart.datasets.push(temp682bDataset);   
                    }
                    
                    
                    
                    for(var j = 0; j < goldChart.datasets.length; j++){
                        var data = [];
                        if(goldChart.datasets[j].label === 'v681'){
                            data = data681;
                        }
                        else if(goldChart.datasets[j].label === 'v682'){
                            data = data682;
                        }
                        else if(goldChart.datasets[j].label === 'v682b'){
                            data = data682b;
                        }
                        
                        for(var i = 0;i < goldChart.datasets[j].points.length;i++){
                            goldChart.datasets[j].points[i].value = Math.floor(data[i]);   
                        }
                    }
                        
                    if(!scope.formCtrl.toggleData.t681){
                        //search for the dataset that has v681 as label
                        for(var i = 0; i < goldChart.datasets.length; i++){
                            if(goldChart.datasets[i].label === 'v681'){
                                temp681Dataset = goldChart.datasets[i];
                                goldChart.datasets.splice(i, 1);
                            }
                        }
                    }
                    if(!scope.formCtrl.toggleData.t682){
                        for(var i = 0; i < goldChart.datasets.length; i++){
                            if(goldChart.datasets[i].label === 'v682'){
                                temp682Dataset = goldChart.datasets[i];
                                goldChart.datasets.splice(i, 1);
                            }
                        }   
                    }
                    if(!scope.formCtrl.toggleData.t682b){
                        for(var i = 0; i < goldChart.datasets.length; i++){
                            if(goldChart.datasets[i].label === 'v682b'){
                                temp682bDataset = goldChart.datasets[i];
                                goldChart.datasets.splice(i, 1);
                            }
                        }   
                    }

                    goldChart.update();
                }
                
                var reCalculateData = function(){
                    data681 = [];
                    data682 = [];
                    data682b = [];
                    
                    if(attr.type==="totalTeamGold"){
                        for(var i = 0; i < 25; i++){
                            data681.push(ClashManager.calculate681TotalTeamGoldGain(scope.formCtrl.victimKillStreak, i+1, scope.formCtrl.assistingHeroes));
                        }
                        //
                        for(var i = 0; i < 25; i++){
                            data682.push(ClashManager.calculate682TotalTeamGoldGain(scope.formCtrl.victimKillStreak, scope.formCtrl.victimNW, i+1, scope.formCtrl.killerTeamNW, scope.formCtrl.victimTeamNW,scope.formCtrl.assistingHeroes));
                        }
                        for(var i = 0; i < 25; i++){
                            data682b.push(ClashManager.calculate682bTotalTeamGoldGain(scope.formCtrl.victimKillStreak, scope.formCtrl.victimNW, i+1, scope.formCtrl.killerTeamNW, scope.formCtrl.victimTeamNW,scope.formCtrl.assistingHeroes));
                        }  
                    }
                    else if(attr.type==="totalTeamExp"){
                        for(var i = 0; i < 25; i++){
                            data681.push(ClashManager.calculate681TotalTeamExpGain(i+1, scope.formCtrl.assistingHeroes));   
                        }
                        for(var i = 0; i < 25; i++){
                            data682.push(ClashManager.calculate682TotalTeamExpGain(i+1, ExperiencePerLevel[i], scope.formCtrl.killerTeamXP, scope.formCtrl.victimTeamXP, scope.formCtrl.assistingHeroes));        
                        }
                        for(var i = 0; i < 25; i++){
                            data682b.push(ClashManager.calculate682bTotalTeamExpGain(i+1, ExperiencePerLevel[i], scope.formCtrl.killerTeamXP, scope.formCtrl.victimTeamXP, scope.formCtrl.assistingHeroes));        
                        }  
                    }
                    if(attr.type ==="totalGold"){
                        for(var i = 0; i < 25; i++){
                            data681.push(ClashManager.calculate681TotalKillGold(scope.formCtrl.victimKillStreak, i+1, scope.formCtrl.assistingHeroes));
                        }
                        //
                        for(var i = 0; i < 25; i++){
                            data682.push(ClashManager.calculate682TotalKillGold(scope.formCtrl.victimKillStreak, scope.formCtrl.victimNW, i+1, scope.formCtrl.killerTeamNW, scope.formCtrl.victimTeamNW,scope.formCtrl.assistingHeroes));
                        }
                        for(var i = 0; i < 25; i++){
                            data682b.push(ClashManager.calculate682bTotalKillGold(scope.formCtrl.victimKillStreak, scope.formCtrl.victimNW, i+1, scope.formCtrl.killerTeamNW, scope.formCtrl.victimTeamNW,scope.formCtrl.assistingHeroes));
                        }  
                    }
                    else if(attr.type==="bonusGold"){
                        for(var i = 0; i < 25; i++){
                            data681.push(ClashManager.calculate681BonusGold(scope.formCtrl.assistingHeroes, i+1));
                        }
                        //
                        for(var i = 0; i < 25; i++){
                            data682.push(ClashManager.calculate682BonusGold(scope.formCtrl.victimNW, i+1, scope.formCtrl.killerTeamNW, scope.formCtrl.victimTeamNW, scope.formCtrl.assistingHeroes));
                        }
                        for(var i = 0; i < 25; i++){
                            data682b.push(ClashManager.calculate682bBonusGold(scope.formCtrl.victimNW, i+1, scope.formCtrl.killerTeamNW, scope.formCtrl.victimTeamNW, scope.formCtrl.assistingHeroes));
                        }
                    }
                    else if(attr.type==="baseGold"){
                        for(var i = 0; i < 25; i++){
                            data681.push(ClashManager.calculate681KillGold(scope.formCtrl.victimKillStreak, i+1));   
                        }
                        for(var i = 0; i < 25; i++){
                            data682.push(ClashManager.calculate682KillGold(scope.formCtrl.victimKillStreak, i+1));        
                        }
                        for(var i = 0; i < 25; i++){
                            data682b.push(ClashManager.calculate682KillGold(scope.formCtrl.victimKillStreak, i+1));        
                        }         
                    }
                    else if(attr.type==="totalExp"){
                        for(var i = 0; i < 25; i++){
                            data681.push(ClashManager.calculate681TotalKillXP(i+1, scope.formCtrl.assistingHeroes));   
                        }
                        for(var i = 0; i < 25; i++){
                            data682.push(ClashManager.calculate682TotalKillXP(i+1, ExperiencePerLevel[i], scope.formCtrl.killerTeamXP, scope.formCtrl.victimTeamXP, scope.formCtrl.assistingHeroes));        
                        }
                        for(var i = 0; i < 25; i++){
                            data682b.push(ClashManager.calculate682bTotalKillXP(i+1, ExperiencePerLevel[i], scope.formCtrl.killerTeamXP, scope.formCtrl.victimTeamXP, scope.formCtrl.assistingHeroes));        
                        }     
                    }
                    else if(attr.type==="bonusExp"){
                        for(var i = 0; i < 25; i++){
                            data681.push(ClashManager.calculate681BonusXP(scope.formCtrl.assistingHeroes, i+1));   
                        }
                        for(var i = 0; i < 25; i++){
                            data682.push(ClashManager.calculate682BonusXP(i+1, ExperiencePerLevel[i], scope.formCtrl.killerTeamXP, scope.formCtrl.victimTeamXP, scope.formCtrl.assistingHeroes));        
                        }
                        for(var i = 0; i < 25; i++){
                            data682b.push(ClashManager.calculate682bBonusXP(i+1, ExperiencePerLevel[i], scope.formCtrl.killerTeamXP, scope.formCtrl.victimTeamXP, scope.formCtrl.assistingHeroes));          
                        }       
                    }
                    else if(attr.type==="baseExp"){
                        for(var i = 0; i < 25; i++){
                            data681.push(ClashManager.calculateKillXP(i+1));
                        }
                        for(var i = 0; i < 25; i++){
                            data682.push(ClashManager.calculateKillXP(i+1));      
                        }
                        for(var i = 0; i < 25; i++){
                            data682b.push(ClashManager.calculateKillXP(i+1));      
                        }       
                    }
                    else if(attr.type==="killsBackToEvenGold"){
                        for(var i = 0; i < 25; i++){
                            var killerTeamNW = scope.formCtrl.killerTeamNW;
                            var victimTeamNW = scope.formCtrl.victimTeamNW;
                            var repeatCounter = 0;
                            while(killerTeamNW < victimTeamNW){
                                repeatCounter+=1;
                                killerTeamNW += ClashManager.calculate681TotalTeamGoldGain(scope.formCtrl.victimKillStreak, i+1, scope.formCtrl.assistingHeroes)
                            }
                            data681.push(repeatCounter);
                        }
                        for(var i = 0; i < 25; i++){
                            var killerTeamNW = scope.formCtrl.killerTeamNW;
                            var victimTeamNW = scope.formCtrl.victimTeamNW;
                            var repeatCounter = 0;
                            while(killerTeamNW < victimTeamNW){
                                repeatCounter+=1;
                                killerTeamNW += ClashManager.calculate682TotalTeamGoldGain(scope.formCtrl.victimKillStreak, scope.formCtrl.victimNW, i+1, killerTeamNW, scope.formCtrl.victimTeamNW,scope.formCtrl.assistingHeroes)
                            }
                            data682.push(repeatCounter);
                        }
                        for(var i = 0; i < 25; i++){
                            var killerTeamNW = scope.formCtrl.killerTeamNW;
                            var victimTeamNW = scope.formCtrl.victimTeamNW;
                            var repeatCounter = 0;
                            while(killerTeamNW < victimTeamNW){
                                repeatCounter+=1;
                                killerTeamNW += ClashManager.calculate682bTotalTeamGoldGain(scope.formCtrl.victimKillStreak, scope.formCtrl.victimNW, i+1, killerTeamNW, scope.formCtrl.victimTeamNW,scope.formCtrl.assistingHeroes)
                            }
                            data682b.push(repeatCounter);
                        }
                    }
                    else if(attr.type==="killsBackToEvenExp"){
                        for(var i = 0; i < 25; i++){
                            var killerTeamXP = scope.formCtrl.killerTeamXP;
                            var victimTeamXP = scope.formCtrl.victimTeamXP;
                            var repeatCounter = 0;
                            while(killerTeamXP < victimTeamXP){
                                repeatCounter+=1;
                                killerTeamXP += ClashManager.calculate681TotalTeamExpGain(i+1, scope.formCtrl.assistingHeroes);
                            }
                            data681.push(repeatCounter);
                        }
                        for(var i = 0; i < 25; i++){
                            var killerTeamXP = scope.formCtrl.killerTeamXP;
                            var victimTeamXP = scope.formCtrl.victimTeamXP;
                            var repeatCounter = 0;
                            while(killerTeamXP < victimTeamXP){
                                repeatCounter+=1;
                                killerTeamXP += ClashManager.calculate682TotalTeamExpGain(i+1, ExperiencePerLevel[i], killerTeamXP, victimTeamXP, scope.formCtrl.assistingHeroes);
                            }
                            data682.push(repeatCounter);
                        }
                        for(var i = 0; i < 25; i++){
                            var killerTeamXP = scope.formCtrl.killerTeamXP;
                            var victimTeamXP = scope.formCtrl.victimTeamXP;
                            var repeatCounter = 0;
                            while(killerTeamXP < victimTeamXP){
                                repeatCounter+=1;
                                killerTeamXP += ClashManager.calculate682bTotalTeamExpGain(i+1, ExperiencePerLevel[i], killerTeamXP, victimTeamXP, scope.formCtrl.assistingHeroes);
                            }
                            data682b.push(repeatCounter);
                        }
                    }
                    else if(attr.type==="killsBackToEvenVictim"){
                        for(var i = 0; i < 25; i++){
                            var killerTeamXP = scope.formCtrl.killerTeamXP;
                            var victimTeamXP = scope.formCtrl.victimTeamXP;
                            var repeatCounter = 0;
                            while(killerTeamXP < victimTeamXP){
                                repeatCounter+=1;
                                killerTeamXP += ClashManager.calculate681TotalTeamExpGain(i+1, scope.formCtrl.assistingHeroes);
                            }
                            data681.push(repeatCounter);
                        }
                        for(var i = 0; i < 25; i++){
                            var killerTeamXP = scope.formCtrl.killerTeamXP;
                            var victimTeamXP = scope.formCtrl.victimTeamXP;
                            var repeatCounter = 0;
                            while(killerTeamXP < victimTeamXP){
                                repeatCounter+=1;
                                killerTeamXP += ClashManager.calculate682TotalTeamExpGain(i+1, ExperiencePerLevel[i], killerTeamXP, victimTeamXP, scope.formCtrl.assistingHeroes);
                            }
                            data682.push(repeatCounter);
                        }
                        for(var i = 0; i < 25; i++){
                            var killerTeamXP = scope.formCtrl.killerTeamXP;
                            var victimTeamXP = scope.formCtrl.victimTeamXP;
                            var repeatCounter = 0;
                            while(killerTeamXP < victimTeamXP){
                                repeatCounter+=1;
                                killerTeamXP += ClashManager.calculate682bTotalTeamExpGain(i+1, ExperiencePerLevel[i], killerTeamXP, victimTeamXP, scope.formCtrl.assistingHeroes);
                            }
                            data682b.push(repeatCounter);
                        }
                    }
                    else if(attr.type==="killsToDoubleGoldLead"){
                        for(var i = 0; i < 25; i++){
                            var killerTeamNW = scope.formCtrl.killerTeamNW;
                            var victimTeamNW = scope.formCtrl.victimTeamNW;
                            var repeatCounter = 0;
                            while(killerTeamNW < victimTeamNW * 2){
                                repeatCounter+=1;
                                killerTeamNW += ClashManager.calculate681TotalTeamGoldGain(scope.formCtrl.victimKillStreak, i+1, scope.formCtrl.assistingHeroes)
                            }
                            data681.push(repeatCounter);
                        }
                        for(var i = 0; i < 25; i++){
                            var killerTeamNW = scope.formCtrl.killerTeamNW;
                            var victimTeamNW = scope.formCtrl.victimTeamNW;
                            var repeatCounter = 0;
                            while(killerTeamNW < victimTeamNW * 2){
                                repeatCounter+=1;
                                killerTeamNW += ClashManager.calculate682TotalTeamGoldGain(scope.formCtrl.victimKillStreak, scope.formCtrl.victimNW, i+1, killerTeamNW, scope.formCtrl.victimTeamNW,scope.formCtrl.assistingHeroes)
                            }
                            data682.push(repeatCounter);
                        }
                        for(var i = 0; i < 25; i++){
                            var killerTeamNW = scope.formCtrl.killerTeamNW;
                            var victimTeamNW = scope.formCtrl.victimTeamNW;
                            var repeatCounter = 0;
                            while(killerTeamNW < victimTeamNW * 2){
                                repeatCounter+=1;
                                killerTeamNW += ClashManager.calculate682bTotalTeamGoldGain(scope.formCtrl.victimKillStreak, scope.formCtrl.victimNW, i+1, killerTeamNW, scope.formCtrl.victimTeamNW,scope.formCtrl.assistingHeroes)
                            }
                            data682b.push(repeatCounter);
                        }
                    }
                    else if(attr.type==="killsToDoubleExpLead"){
                        for(var i = 0; i < 25; i++){
                            var killerTeamXP = scope.formCtrl.killerTeamXP;
                            var victimTeamXP = scope.formCtrl.victimTeamXP;
                            var repeatCounter = 0;
                            while(killerTeamXP < victimTeamXP * 2){
                                repeatCounter+=1;
                                killerTeamXP += ClashManager.calculate681TotalTeamExpGain(i+1, scope.formCtrl.assistingHeroes);
                            }
                            data681.push(repeatCounter);
                        }
                        for(var i = 0; i < 25; i++){
                            var killerTeamXP = scope.formCtrl.killerTeamXP;
                            var victimTeamXP = scope.formCtrl.victimTeamXP;
                            var repeatCounter = 0;
                            while(killerTeamXP < victimTeamXP * 2){
                                repeatCounter+=1;
                                killerTeamXP += ClashManager.calculate682TotalTeamExpGain(i+1, ExperiencePerLevel[i], killerTeamXP, victimTeamXP, scope.formCtrl.assistingHeroes);
                            }
                            data682.push(repeatCounter);
                        }
                        for(var i = 0; i < 25; i++){
                            var killerTeamXP = scope.formCtrl.killerTeamXP;
                            var victimTeamXP = scope.formCtrl.victimTeamXP;
                            var repeatCounter = 0;
                            while(killerTeamXP < victimTeamXP * 2){
                                repeatCounter+=1;
                                killerTeamXP += ClashManager.calculate682bTotalTeamExpGain(i+1, ExperiencePerLevel[i], killerTeamXP, victimTeamXP, scope.formCtrl.assistingHeroes);
                            }
                            data682b.push(repeatCounter);
                        }
                    }

                }

                var datasets = [
                    {
                        label: 'v681',
                        fillColor: 'rgba(220, 220, 220, 0)',
                        pointColor: "#0062ff",
                        strokeColor: "#0062ff",
                        
                        data: emptydefaults
                    },
                    {
                        label: 'v682',
                        fillColor: 'rgba(220, 220, 220, 0)',
                        pointColor: "#f00",
                        strokeColor: "#f00",
                        data: emptydefaults
                    },
                    {
                        label: 'v682b',
                        fillColor: 'rgba(220, 220, 220, 0)',
                        pointColor: "#ffb220",
                        strokeColor: "#ffb220",
                        data: emptydefaults
                    }
                ];
                var data = {
                    labels: labels,
                    datasets: datasets
                }
                var options = {
                     //String - A legend template
                    animation: false,
                    responsive: true,

                };   
               
                var goldChart = new Chart(elem[0].getContext('2d')).Line(data, options);

                scope.$watchCollection('[formCtrl.victimKillStreak, formCtrl.victimNW, formCtrl.killerTeamXP, formCtrl.victimTeamXP, formCtrl.victimTeamNW, formCtrl.killerTeamNW, formCtrl.assistingHeroes, formCtrl.toggleData.t681, formCtrl.toggleData.t682, formCtrl.toggleData.t682b]', function(newValues, oldValues){
                        reCalculateData();
                        reupdateChartData();
                }, true);
            }
        }
    });
    


    app.factory('ClashManager', function(){
        
        return new function(){
            /**
            will only take in a complete team radiant and dire
            targets random opponent on opposite team and calculates gold won and lost based on the amount of support
            */
            var that = this;

            /**
            clash will take the team and execute a fight with the options applied.
            will calculate for all versions
            1. calculate amt of gold and xp earned from single kill
            2. calculate amt of bonus gold earned for team argh I dunno.
            */

            //base xp is shared, calculateKillXP is shared amongst assists,
            //bonus xp is for each individual
            
            this.calculate681TotalTeamGoldGain = function(victimKillStreak, victimLevel, assists){
                var totalTeamGold = 0;
                totalTeamGold += that.calculate681KillGold(victimKillStreak, victimLevel);
                totalTeamGold += that.calculate681BonusGold(assists, victimLevel) * (assists-1);
                return Math.floor(totalTeamGold);
            }
            
            this.calculate682TotalTeamGoldGain = function(victimKillStreak, victimNW, victimLevel, alliedTeamNW, enemyTeamNW,involvedHeroCount){
                var totalTeamGold = 0;
                totalTeamGold += that.calculate682KillGold(victimKillStreak, victimLevel);
                totalTeamGold += that.calculate682BonusGold(victimNW, victimLevel, alliedTeamNW, enemyTeamNW, involvedHeroCount)*involvedHeroCount;
                return Math.floor(totalTeamGold);
            }
            
            this.calculate682bTotalTeamGoldGain = function(victimKillStreak, victimNW, victimLevel, alliedTeamNW, enemyTeamNW,involvedHeroCount){
                var totalTeamGold = 0;
                totalTeamGold += that.calculate682KillGold(victimKillStreak, victimLevel);
                totalTeamGold += that.calculate682bBonusGold(victimNW,victimLevel,alliedTeamNW,enemyTeamNW,involvedHeroCount) * involvedHeroCount;
                return Math.floor(totalTeamGold);
            }
            
            this.calculate681TotalTeamExpGain = function(victimLevel, assists){
                var totalTeamXP = 0;
                totalTeamXP += that.calculateKillXP(victimLevel);
                totalTeamXP += that.calculate681BonusXP(assists, victimLevel) * assists;
                return Math.floor(totalTeamXP);
            }
            
            this.calculate682TotalTeamExpGain = function(victimLevel, victimXP, alliedTeamXP, enemyTeamXP, involvedHeroCount){
                var totalTeamXP = 0;
                totalTeamXP += that.calculateKillXP(victimLevel);
                totalTeamXP += that.calculate682BonusXP(victimLevel,victimXP,alliedTeamXP,enemyTeamXP,involvedHeroCount) * involvedHeroCount;
                return Math.floor(totalTeamXP);
            }
            
            this.calculate682bTotalTeamExpGain = function(victimLevel, victimXP, alliedTeamXP, enemyTeamXP, involvedHeroCount){
                var totalTeamXP = 0;
                totalTeamXP += that.calculateKillXP(victimLevel);
                totalTeamXP += that.calculate682bBonusXP(victimLevel,victimXP,alliedTeamXP,enemyTeamXP,involvedHeroCount) * involvedHeroCount;
                return totalTeamXP;
            }
            
            this.calculate681TotalKillGold = function(victimKillStreak, victimLevel, assists){
                var totalTeamGold = 0;
                totalTeamGold += that.calculate681KillGold(victimKillStreak, victimLevel);
                totalTeamGold += that.calculate681BonusGold(assists, victimLevel);
                return Math.floor(totalTeamGold);
            }
            
            this.calculate681TotalKillXP = function(victimLevel, assists){
                var totalTeamXP = 0;
                totalTeamXP += that.calculateKillXP(victimLevel)/assists;
                totalTeamXP += that.calculate681BonusXP(assists, victimLevel);
                return Math.floor(totalTeamXP);
            }
            
            this.calculate682TotalKillGold = function(victimKillStreak, victimNW, victimLevel, alliedTeamNW, enemyTeamNW,involvedHeroCount){
                var totalTeamGold = 0;
                totalTeamGold += that.calculate682KillGold(victimKillStreak, victimLevel);
                totalTeamGold += that.calculate682BonusGold(victimNW, victimLevel, alliedTeamNW, enemyTeamNW, involvedHeroCount);
                
                return Math.floor(totalTeamGold);
            }
            
            this.calculate682TotalKillXP = function(victimLevel, victimXP, alliedTeamXP, enemyTeamXP, involvedHeroCount){
                var totalTeamXP = 0;
                totalTeamXP += that.calculateKillXP(victimLevel)/involvedHeroCount;
                totalTeamXP += that.calculate682BonusXP(victimLevel,victimXP,alliedTeamXP,enemyTeamXP,involvedHeroCount);
                return Math.floor(totalTeamXP);
            }
            
            this.calculate682bTotalKillGold = function(victimKillStreak, victimNW, victimLevel, alliedTeamNW, enemyTeamNW,involvedHeroCount){
                var totalTeamGold = 0;
                totalTeamGold += that.calculate682KillGold(victimKillStreak, victimLevel);
                totalTeamGold += that.calculate682bBonusGold(victimNW,victimLevel,alliedTeamNW,enemyTeamNW,involvedHeroCount);
                return Math.floor(totalTeamGold);
            }
            
            this.calculate682bTotalKillXP = function(victimLevel, victimXP, alliedTeamXP, enemyTeamXP, involvedHeroCount){
                var totalTeamXP = 0;
                totalTeamXP += that.calculateKillXP(victimLevel)/involvedHeroCount;
                totalTeamXP += that.calculate682bBonusXP(victimLevel,victimXP,alliedTeamXP,enemyTeamXP,involvedHeroCount);
                return totalTeamXP;
            }
            
            this.calculate681KillGold = function(victimKillStreak, victimLevel){
                var killstreakGold = 0;
                switch(victimKillStreak){
                    case 3:
                        killstreakGold = 125;
                        break;
                    case 4:
                        killstreakGold = 250;
                        break;
                    case 5:
                        killstreakGold = 375;
                        break;
                    case 6:
                        killstreakGold = 500;
                        break;
                    case 7:
                        killstreakGold = 625;
                        break;
                    case 8:
                        killstreakGold = 750;
                        break;
                    case 9:
                        killstreakGold = 875;
                        break;
                    case 10:
                        killstreakGold = 1000;
                        break;
                    default:
                        killstreakGold = 0;
                        break;  
                }

                return 200 + killstreakGold + (victimLevel * 9);
            }
            
            //natural Kill experience hasn't changed since 6.81 -> 6.82
            
            this.calculateKillXP = function(victimLevel){
                /**
                Base hero xp taken from
                www.playdota.com/mechanics/experience
                */
                
                var baseXP = 0;
                switch(victimLevel){
                    case 1:
                        baseXP = 100;
                        break;
                    case 2:
                        baseXP = 120;
                        break;
                    case 3:
                        baseXP = 160;
                        break;
                    case 4:
                        baseXP = 220;
                        break;
                    case 5:
                        baseXP = 300;
                        break;
                    case 6:
                        baseXP = 400;
                        break;
                    case 7:
                        baseXP = 500;
                        break;
                    case 8:
                        baseXP = 600;
                        break;
                    case 9:
                        baseXP = 700;
                        break;
                    case 10:
                        baseXP = 800;
                        break;
                    case 11:
                        baseXP = 900;
                        break;
                    case 12:
                        baseXP = 1000;
                        break;
                    case 13:
                        baseXP = 1100;
                        break;
                    case 14:
                        baseXP = 1200;
                        break;
                    case 15:
                        baseXP = 1300;
                        break;
                    case 16:
                        baseXP = 1400;
                        break;
                    case 17:
                        baseXP = 1500;
                        break;
                    case 18:
                        baseXP = 1600;
                        break;
                    case 19:
                        baseXP = 1700;
                        break;
                    case 20:
                        baseXP = 1800;
                        break;
                    case 21:
                        baseXP = 1900;
                        break;
                    case 22:
                        baseXP = 2000;
                        break;
                    case 23:
                        baseXP = 2100;
                        break;
                    case 24:
                        baseXP = 2200;
                        break;
                    case 25:
                        baseXP = 2300;
                        break;
                }
                return baseXP;
            }
            
            //Couldn't anticipate the amount of patches that would be coming in that would require another tweak addition configuration.
            this.calculate682KillGold = function(victimKillStreak, victimLevel){
                /**
                changed after sept 27 patch 
                Kill Streak Bounty from 100->800 to 60->480 (6.81 values are 125->1000)
                */
                var killstreakGold = 0;
                switch(victimKillStreak){
                    case 3:
                        killstreakGold = 60;
                        break;
                    case 4:
                        killstreakGold = 120;
                        break;
                    case 5:
                        killstreakGold = 180;
                        break;
                    case 6:
                        killstreakGold = 240;
                        break;
                    case 7:
                        killstreakGold = 300;
                        break;
                    case 8:
                        killstreakGold = 360;
                        break;
                    case 9:
                        killstreakGold = 420;
                        break;
                    case 10:
                        killstreakGold = 480;
                        break;
                    default:
                        killstreakGold = 0;
                        break;  
                }
                
                return 200 + killstreakGold + (victimLevel * 9);
            }
            
            
        
            this.calculate681BonusXP = function(involvedHeroCount, victimLevel){
                /**
                
                Old:
                ==============
                VictimLevel = Level of the Victim

                1 Hero: XP = 120 + 20 * VictimLevel
                2 Heroes: XP = 90 + 15 * VictimLevel
                3 Heroes: XP = 30 + 7 * VictimLevel
                4 Heroes: XP = 20 + 5 * VictimLevel
                5 Heroes: XP = 15 + 4 * VictimLevel
                */
                switch(involvedHeroCount){
                    case 1:
                        return 120 + 20 * victimLevel;
                        break;
                    case 2:
                        return 90 + 15 * victimLevel;
                        break;
                    case 3: 
                        return 30 + 7 * victimLevel;
                        break;
                    case 4:
                        return 20 + 5 * victimLevel;
                        break;
                    case 5:
                        return 15 + 4 * victimLevel;
                        break; 
                }
                
            }
            
            this.calculate681BonusGold = function(involvedHeroCount, victimLevel){
                /**
                Old:
                ==============
                VictimLevel = Level of the Victim

                1 Assist: Gold = 125 + 12 * VictimLevel
                2 Assist: Gold = 40 + 10 * VictimLevel
                3 Assist: Gold = 10 + 6 * VictimLevel
                4+ Assist: Gold = 6 + 6 * VictimLevel
                */
                switch(involvedHeroCount){
                        //solo hero kills do not get an extra bounty in 6.81
                    case 1:
                        return 0;
                        break;
                    case 2:
                        return 125 + 12 * victimLevel;
                        break;
                    case 3:
                        return 40 + 10 * victimLevel;
                        break;
                    case 4: 
                        return 10 + 6 * victimLevel;
                        break;
                    case 5:
                        return 6 + 6 * victimLevel;
                        break;
                }
                
            }
            
            this.calculate682BonusXP = function(victimLevel, victimXP, alliedTeamXP, enemyTeamXP, involvedHeroCount){
                
                /**
                This change only affects the extra XP given if within an area after a kill. 
                It does not affect the natural XP you get for killing a hero of a certain Level. 
                the killer also benefits from bonus xp

                I think these values are already pre-split.. meaning I don't need to further split the xp between assists.

                New:
                ==============
                VictimLevel = Level of the Victim
                VictimXP = Total XP of the Victim
                EnemyTeamXP = Enemy team's total XP
                AlliedTeamXP = Your team's total XP
                XPDifference = ( EnemyTeamXP - AlliedTeamXP )/ ( EnemyTeamXP + AlliedTeamXP ) (minimum 0)
                XPFactor = XPDifference * VictimXP

                1 Hero: XP = 20 * VictimLevel + XPFactor * 0.5
                2 Heroes: XP = 15 * VictimLevel + XPFactor * 0.35
                3 Heroes: XP = 10 * VictimLevel + XPFactor * 0.25
                4 Heroes: XP = 7 * VictimLevel + XPFactor * 0.2
                5 Heroes: XP = 5 * VictimLevel + XPFactor * 0.15
                */

                var xpDifference = (enemyTeamXP - alliedTeamXP) / (enemyTeamXP + alliedTeamXP);
                if(isNaN(xpDifference)||xpDifference < 0){xpDifference=0;};
                var xpFactor = xpDifference * victimXP;
                
                switch(involvedHeroCount){
                    case 1:
                        return 20 * victimLevel + xpFactor * 0.5;
                        break;
                    case 2:
                        return 15 * victimLevel + xpFactor * 0.35;
                        break;
                    case 3:
                        return 10 * victimLevel + xpFactor * 0.25;
                        break;
                    case 4:
                        return 7 * victimLevel + xpFactor * 0.2;
                        break;
                    case 5:
                        return 5 * victimLevel + xpFactor * 0.15;
                        break;
                }
            }
            
            this.calculate682bBonusXP = function(victimLevel, victimXP, alliedTeamXP, enemyTeamXP, involvedHeroCount){
                
                /**
                This change only affects the extra XP given if within an area after a kill. 
                It does not affect the natural XP you get for killing a hero of a certain Level. 
                the killer also benefits from bonus xp

                I think these values are already pre-split.. meaning I don't need to further split the xp between assists.

                New:
                ==============
                VictimLevel = Level of the Victim
                VictimXP = Total XP of the Victim
                EnemyTeamXP = Enemy team's total XP
                AlliedTeamXP = Your team's total XP
                XPDifference = ( EnemyTeamXP - AlliedTeamXP )/ ( EnemyTeamXP + AlliedTeamXP ) (minimum 0)
                XPFactor = XPDifference * VictimXP

                6.82b XP Factors:
                ----------------------
                1 Hero: XP = 20 * VictimLevel + XPFactor * 0.3
                2 Heroes: XP = 15 * VictimLevel + XPFactor * 0.3
                3 Heroes: XP = 10 * VictimLevel + XPFactor * 0.2
                4 Heroes: XP = 7 * VictimLevel + XPFactor * 0.15
                5 Heroes: XP = 5 * VictimLevel + XPFactor * 0.12
                */

                var xpDifference = (enemyTeamXP - alliedTeamXP) / (enemyTeamXP + alliedTeamXP);
                if(isNaN(xpDifference) || xpDifference < 0){xpDifference=0;};
                var xpFactor = xpDifference * victimXP;
                
                switch(involvedHeroCount){
                    case 1:
                        return 20 * victimLevel + xpFactor * 0.3;
                        break;
                    case 2:
                        return 15 * victimLevel + xpFactor * 0.3;
                        break;
                    case 3:
                        return 10 * victimLevel + xpFactor * 0.2;
                        break;
                    case 4:
                        return 7 * victimLevel + xpFactor * 0.15;
                        break;
                    case 5:
                        return 5 * victimLevel + xpFactor * 0.12;
                        break;
                }
            }
            
            this.calculate682BonusGold = function(victimNW, victimLevel, alliedTeamNW, enemyTeamNW,involvedHeroCount){
                /**
                This change only affects the extra Gold given if within an area after a kill. 
                It does not affect the natural Gold received for killing a hero of a certain Level/Streak. 



                New:
                ==============
                The player that got the last hit now also gets the area of effect bounty.

                VictimLevel = Level of the Victim
                VictimNW = The victim's Net Worth
                EnemyTeamNW = Enemy team's total Net Worth
                AlliedTeamNW = Your team's total Net Worth
                NWDifference = ( EnemyTeamNW - AlliedTeamNW )/ ( EnemyTeamNW + AlliedTeamNW ) (minimum 0)
                NWFactor = NWDifference * VictimNW

                1 Hero: Gold = 40 + 7 * VictimLevel + NWFactor * 0.5
                2 Heroes: Gold = 30 + 6 * VictimLevel + NWFactor * 0.35
                3 Heroes: Gold = 20 + 5 * VictimLevel + NWFactor * 0.25
                4 Heroes: Gold = 10 + 4 * VictimLevel + NWFactor * 0.2
                5 Heroes: Gold = 10 + 4 * VictimLevel + NWFactor * 0.15

                In combination with these changes, the gold for ending a spree is in turn reduced, from 125->1000 to 100->800. 
                
                ADDENDUM, changed after sept 27 patch 
                Reduced AoE Gold bonus Net Worth Factor for 1/2/3/4/5 hero kills from 0.5/0.35/0.25/0.2/0.15 to 0.26/0.22/0.18/0.14/0.10
                */
                
                var nwDifference = (enemyTeamNW - alliedTeamNW) / (enemyTeamNW + alliedTeamNW);
                if(isNaN(nwDifference) || nwDifference < 0){nwDifference=0;};
                var nwFactor = nwDifference * victimNW;
                
                switch(involvedHeroCount){
                    case 1:
                        return 40 + 7 * victimLevel + nwFactor * 0.26;
                        break;
                    case 2:
                        return 30 + 6 * victimLevel + nwFactor * 0.22;
                        break;
                    case 3:
                        return 20 + 5 * victimLevel + nwFactor * 0.18;
                        break;
                    case 4:
                        return 10 + 4 * victimLevel + nwFactor * 0.14;
                        break;
                    case 5:
                        return 10 + 4 * victimLevel + nwFactor * 0.10;
                        break;
                }
            }
            
            this.calculate682bBonusGold = function(victimNW, victimLevel, alliedTeamNW, enemyTeamNW,involvedHeroCount){
                /**
                This change only affects the extra Gold given if within an area after a kill. 
                It does not affect the natural Gold received for killing a hero of a certain Level/Streak. 



                New:
                ==============
                The player that got the last hit now also gets the area of effect bounty.

                6.82b Gold Formula
                -------------------------
                VictimLevel = Level of the Victim
                VictimNW = The victim's Net Worth
                EnemyTeamNW = Enemy team's total Net Worth
                AlliedTeamNW = Your team's total Net Worth
                NWDifference = ( EnemyTeamNW / AlliedTeamNW ) - 1 [Min 0, Max 1]
                NWFactor = NWDifference * VictimNW

                1 Hero: Gold = 40 + 7 * VictimLevel + NWFactor * 0.06
                2 Heroes: Gold = 30 + 6 * VictimLevel + NWFactor * 0.06
                3 Heroes: Gold = 20 + 5 * VictimLevel + NWFactor * 0.05
                4 Heroes: Gold = 10 + 4 * VictimLevel + NWFactor * 0.04
                5 Heroes: Gold = 10 + 4 * VictimLevel + NWFactor * 0.03

                                6.82b Full details (from initial 6.82 to 6.82b)
                ===========================
                * Kill Streak Bounty from 100->800 to 60->480 (6.81: 125->1000)
                * Adjusted bonus area of effect Gold and XP 
                ADDENDUM, changed after sept 27 patch 
                Reduced AoE Gold bonus Net Worth Factor for 1/2/3/4/5 hero kills from 0.5/0.35/0.25/0.2/0.15 to 0.26/0.22/0.18/0.14/0.10
                */
                var nwDifference = (enemyTeamNW / alliedTeamNW) - 1;
                if(nwDifference > 1){nwDifference = 1;};
                if(isNaN(nwDifference) || nwDifference < 0){nwDifference = 0;};
                var nwFactor = nwDifference * victimNW;
                
                switch(involvedHeroCount){
                    case 1:
                        return 40 + 7 * victimLevel + nwFactor * 0.06;
                        break;
                    case 2:
                        return 30 + 6 * victimLevel + nwFactor * 0.06;
                        break;
                    case 3:
                        return 20 + 5 * victimLevel + nwFactor * 0.05;
                        break;
                    case 4:
                        return 10 + 4 * victimLevel + nwFactor * 0.04;
                        break;
                    case 5:
                        return 10 + 4 * victimLevel + nwFactor * 0.03;
                        break;
                }
            }
        }
    });

    app.directive('fitHeight', function(){
        return{
            restrict: 'A',
            link: function(scope, elem, attr){
                $(elem).css('height', innerHeight-40);
            }
        }
    });
    
    app.directive('presets', function(){
        return{
            restrict: 'A',
            link: function(scope, elem, attr){
                $(elem).on('click', function(){
                    scope.$apply(function(){
                        if(attr.type==="hugeDeficit"){
                            scope.formCtrl.victimNW = 31850;
                            scope.formCtrl.victimTeamNW = 159250;
                            scope.formCtrl.victimTeamXP = 162000;
                            scope.formCtrl.killerTeamXP = 7000;
                            scope.formCtrl.killerTeamNW = 15750;
                        }
                        else if(attr.type==="deficit"){
                            scope.formCtrl.victimNW = 13425;
                            scope.formCtrl.victimTeamNW = 45000;
                            scope.formCtrl.victimTeamXP = 82000;
                            scope.formCtrl.killerTeamXP = 52000;
                            scope.formCtrl.killerTeamNW = 28000;
                        }
                        else if(attr.type==="slightDeficit"){
                            scope.formCtrl.victimNW = 13425;
                            scope.formCtrl.victimTeamNW = 45000;
                            scope.formCtrl.victimTeamXP = 82000;
                            scope.formCtrl.killerTeamXP = 72000;
                            scope.formCtrl.killerTeamNW = 34000;
                        }
                        else if(attr.type==="even"){
                            scope.formCtrl.victimNW = 18430;
                            scope.formCtrl.victimTeamNW = 87500;
                            scope.formCtrl.victimTeamXP = 84500;
                            scope.formCtrl.killerTeamXP = 84500;
                            scope.formCtrl.killerTeamNW = 87500;
                        }
                        else if(attr.type==="slightLead"){
                            scope.formCtrl.victimNW = 13425;
                            scope.formCtrl.victimTeamNW = 34000;
                            scope.formCtrl.victimTeamXP = 72000;
                            scope.formCtrl.killerTeamXP = 82000;
                            scope.formCtrl.killerTeamNW = 45000;
                        }
                        else if(attr.type==="lead"){
                            scope.formCtrl.victimNW = 13425;
                            scope.formCtrl.victimTeamNW = 28000;
                            scope.formCtrl.victimTeamXP = 52000;
                            scope.formCtrl.killerTeamXP = 82000;
                            scope.formCtrl.killerTeamNW = 45000;
                        }
                        else if(attr.type==="hugeLead"){
                            scope.formCtrl.victimNW = 5620;
                            scope.formCtrl.victimTeamNW = 15750;
                            scope.formCtrl.victimTeamXP = 7000;
                            scope.formCtrl.killerTeamXP = 162000;
                            scope.formCtrl.killerTeamNW = 159250;
                        }
                    });
                });
            }
        }
    });
    
    app.directive('sticky', function(){
        return{
            restrict: 'A',
            link: function(scope, elem, attr){
                var ogOffsetTop = $(elem).offset().top;
                $(window).on('scroll', function(){
                    if($(window).scrollTop() > ogOffsetTop){
                         $(elem).css('top', $(window).scrollTop() - ogOffsetTop);
                    }
                    else{
                        $(elem).css('top', '0');
                    }
                });
            }
        }
    });
    
    app.constant('ExperiencePerLevel', [0,200,500,900,1400,2000,2600,3200,4400,5400,6000,8200,9000,10400,11900,13500,15200,17000,18900,20900,23000,25200,27500,29900,32400]);
    
    app.constant('KillstreakMessages', ['', '', '', 'Killing Spree', 'Dominating', 'Mega Kill', 'Unstoppable', 'Wicked Sick', 'Monster Kill', 'Godlike', 'Beyond Godlike']);
})();
