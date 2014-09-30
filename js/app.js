(function(){
    var app = new angular.module('bonus', []);


    
    app.controller('FormController', function($scope){
        var that = this;

        this.victimNW = 2000;
        this.killerTeamXP = 10000;
        this.victimTeamXP = 10000;
        this.victimKillStreak = 0;
        this.victimTeamNW = 10000;
        this.killerTeamNW = 10000;
        this.assistingHeroes = 1;
        
        
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
                                    

                
                var reupdateChartData = function(){
                    
                        for(var i = 0;i < goldChart.datasets[0].points.length;i++){
                            goldChart.datasets[0].points[i].value = Math.floor(data681[i]);   
                        }
                        for(var i = 0;i < goldChart.datasets[1].points.length;i++){
                            goldChart.datasets[1].points[i].value = Math.floor(data682[i]);   
                        }
                        for(var i = 0;i < goldChart.datasets[2].points.length;i++){
                            goldChart.datasets[2].points[i].value = Math.floor(data682b[i]);   
                        }
                    

                    goldChart.update();
                }
                
                var reCalculateData = function(){
                    data681 = [];
                    data682 = [];
                    data682b = [];

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
                    else if(attr.type==="individualGold"){
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
                    else if(attr.type==="individualExp"){
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

                scope.$watchCollection('[formCtrl.victimKillStreak, formCtrl.victimNW, formCtrl.killerTeamXP, formCtrl.victimTeamXP, formCtrl.victimTeamNW, formCtrl.killerTeamNW, formCtrl.assistingHeroes]', function(newValues, oldValues){
                    var pendingAction = false;
                        reCalculateData();
                        reupdateChartData();
                });
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

            
            this.calculate681TotalKillGold = function(victimKillStreak, victimLevel, assists){
                var totalTeamGold = 0;
                totalTeamGold += that.calculate681KillGold(victimKillStreak, victimLevel);
                totalTeamGold += that.calculate681BonusGold(assists, victimLevel);
                return Math.floor(totalTeamGold);
            }
            
            this.calculate681TotalKillXP = function(victimLevel, assists){
                var totalTeamXP = 0;
                totalTeamXP += that.calculateKillXP(victimLevel);
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
                totalTeamXP += that.calculateKillXP(victimLevel);
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
                totalTeamXP += that.calculateKillXP(victimLevel);
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
                    case 1:
                        return 125 + 12 * victimLevel;
                        break;
                    case 2:
                        return 40 + 10 * victimLevel;
                        break;
                    case 3: 
                        return 10 + 6 * victimLevel;
                        break;
                    case 4:
                        return 6 + 6 * victimLevel;
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

                In combination with these changes, the gold for ending a spree is in turn reduced, from 125->1000 to 100->800. 
                
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
                            scope.formCtrl.victimKillStreak = 10;
                            scope.formCtrl.victimTeamNW = 159250;
                            scope.formCtrl.victimTeamXP = 162000;
                            scope.formCtrl.killerTeamXP = 7000;
                            scope.formCtrl.killerTeamNW = 15750;
                            scope.formCtrl.assistingHeroes = 1;
                        }
                        else if(attr.type==="deficit"){
                            scope.formCtrl.victimNW = 13425;
                            scope.formCtrl.victimKillStreak = 8;
                            scope.formCtrl.victimTeamNW = 45000;
                            scope.formCtrl.victimTeamXP = 82000;
                            scope.formCtrl.killerTeamXP = 52000;
                            scope.formCtrl.killerTeamNW = 28000;
                            scope.formCtrl.assistingHeroes = 1;
                        }
                        else if(attr.type==="slightDeficit"){
                            scope.formCtrl.victimNW = 13425;
                            scope.formCtrl.victimKillStreak = 4;
                            scope.formCtrl.victimTeamNW = 45000;
                            scope.formCtrl.victimTeamXP = 82000;
                            scope.formCtrl.killerTeamXP = 72000;
                            scope.formCtrl.killerTeamNW = 34000;
                            scope.formCtrl.assistingHeroes = 1;
                        }
                        else if(attr.type==="even"){
                            scope.formCtrl.victimNW = 18430;
                            scope.formCtrl.victimKillStreak = 1;
                            scope.formCtrl.victimTeamNW = 87500;
                            scope.formCtrl.victimTeamXP = 84500;
                            scope.formCtrl.killerTeamXP = 84500;
                            scope.formCtrl.killerTeamNW = 87500;
                            scope.formCtrl.assistingHeroes = 1;
                        }
                        else if(attr.type==="slightLead"){
                            scope.formCtrl.victimNW = 13425;
                            scope.formCtrl.victimKillStreak = 1;
                            scope.formCtrl.victimTeamNW = 34000;
                            scope.formCtrl.victimTeamXP = 72000;
                            scope.formCtrl.killerTeamXP = 82000;
                            scope.formCtrl.killerTeamNW = 45000;
                            scope.formCtrl.assistingHeroes = 1;
                        }
                        else if(attr.type==="lead"){
                            scope.formCtrl.victimNW = 13425;
                            scope.formCtrl.victimKillStreak = 1;
                            scope.formCtrl.victimTeamNW = 28000;
                            scope.formCtrl.victimTeamXP = 52000;
                            scope.formCtrl.killerTeamXP = 82000;
                            scope.formCtrl.killerTeamNW = 45000;
                            scope.formCtrl.assistingHeroes = 1;
                        }
                        else if(attr.type==="hugeLead"){
                            scope.formCtrl.victimNW = 5620;
                            scope.formCtrl.victimKillStreak = 1;
                            scope.formCtrl.victimTeamNW = 15750;
                            scope.formCtrl.victimTeamXP = 7000;
                            scope.formCtrl.killerTeamXP = 162000;
                            scope.formCtrl.killerTeamNW = 159250;
                            scope.formCtrl.assistingHeroes = 1;
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
})();