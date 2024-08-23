import axios from 'axios';
import cron from 'node-cron';
import {Utils} from '../utils/utils';
// import { PlanModel } from '../models/planModel';
import {ObjectId} from 'mongodb';

export async function CronJobs() {
    try {
        cron.schedule('0 0,12 * * *', generateUserPlans);
        // console.log('TEST CRON');
    } catch (error) {
        console.log('Error in Checking READY TOURNAMENT');
        console.log(error);
    }
}

async function generateUserPlans() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7);

    const previousDate = currentDate.toISOString().split('T')[0];
    // const plans: any = await PlanModel.GetAll({repeat_weekly: true, start_date: previousDate});

    /*for(let plan of plans) {
        const todayDate = new Date().toISOString().split('T')[0];
        plan.start_date = todayDate;
        let meals = [];
        for(let meal of plan.meals) {
            let date = new Date(meal.date);
            date.setDate(date.getDate() + 7);
            let year = date.getFullYear();
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let day = String(date.getDate()).padStart(2, '0');
            let futureDate = `${year}-${month}-${day}`;
            meal.date = futureDate;
            meals.push(meal);
        }
        plan.meals = meals;
        await PlanModel.Update(plan._id, plan, new ObjectId(plan.user_id));
    }*/
}

// (async () => {
//   await CronJobs();
// })();
